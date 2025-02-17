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

  return app;
};
