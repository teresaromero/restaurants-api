import path from 'path';

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import { NewAuthRouter } from '../routes/auth.routes';
import { NewAuthController } from '../controllers/auth.controllers';
import { NewAuthServices } from '../services/auth.services';
import { PrismaClient } from '@prisma/client';
import { NewUsersRepository } from '../repositories/user.repository';
import { NewBcryptParser } from '../libs/passwords';
import { NewJWTUtil } from '../libs/jwt';
import { NewMeRouter } from '../routes/me.routes';
import { NewAuthMiddleware } from '../middlewares/auth.middleware';
import { NewRestaurantsRouter } from '../routes/restaurants.routes';
import { NewRestaurantsController } from '../controllers/restaurants.controllers';
import { NewRestaurantsServices } from '../services/restaurants.services';
import { NewRestaurantRepository } from '../repositories/restaurant.repository';
import { NewReviewRepository } from '../repositories/review.repository';
import { NewReviewsServices } from '../services/reviews.services';
import { NewReviewsController } from '../controllers/reviews.controllers';

interface Config {
  jwtSecret: string;
  jwtExpiresIn: number;
  hashSalt: number;
}

export default async (config: Config) => {
  const app = express();
  app.use(express.json());

  if (process.env.NODE_ENV === 'development') {
    const openapiFile: swaggerUi.JsonObject = YAML.load(
      path.join(__dirname, '../../openapi.yaml'),
    );

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiFile));
  }

  const hashUtil = NewBcryptParser(config.hashSalt);
  const jwtUtil = NewJWTUtil(config.jwtSecret, config.jwtExpiresIn);

  const prismaClient = new PrismaClient();
  try {
    await prismaClient.$connect();
  } catch (error) {
    throw new Error(`Error connecting to the database: ${error}`);
  }

  const userRepository = NewUsersRepository(prismaClient.user);

  const authService = NewAuthServices(userRepository, hashUtil, jwtUtil);
  const authController = NewAuthController(authService);
  const authRouter = NewAuthRouter(authController);
  app.use('/auth', authRouter);

  const authMiddlewares = NewAuthMiddleware(jwtUtil);

  const meRouter = NewMeRouter(authMiddlewares);
  app.use('/me', meRouter);

  const restaurantRepository = NewRestaurantRepository(prismaClient.restaurant);
  const restaurantService = NewRestaurantsServices(restaurantRepository);
  const restaurantsController = NewRestaurantsController(restaurantService);

  const reviewsRepository = NewReviewRepository(prismaClient.review);
  const reviewService = NewReviewsServices(reviewsRepository);
  const reviewsController = NewReviewsController(reviewService);

  const restaurantsRouter = NewRestaurantsRouter(authMiddlewares, {
    restaurants: restaurantsController,
    reviews: reviewsController,
  });
  app.use('/restaurants', restaurantsRouter);

  return app;
};
