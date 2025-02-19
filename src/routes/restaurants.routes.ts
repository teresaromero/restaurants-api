import express, { RequestHandler, Request, Response } from 'express';

interface Middlewares {
  authenticated: RequestHandler;
  onlyAdminAuthorized: RequestHandler;
}

interface ReviewsController {
  getListForRestaurant: (req: Request, res: Response) => Promise<void>;
  createForRestaurant: (req: Request, res: Response) => Promise<void>;
}

interface RestaurantsController {
  getRestaurantsList: (req: Request, res: Response) => Promise<void>;
  getRestaurant: (req: Request, res: Response) => Promise<void>;
  createRestaurant: (req: Request, res: Response) => Promise<void>;
  updateRestaurant: (req: Request, res: Response) => Promise<void>;
}

interface Controllers {
  reviews: ReviewsController;
  restaurants: RestaurantsController;
}

export const NewRestaurantsRouter = (
  middlewares: Middlewares,
  controllers: Controllers,
): {
  publicRouter: express.Router;
  privateRouter: express.Router;
  adminRouter: express.Router;
} => {
  const publicRouter = express.Router();
  publicRouter.get('/', controllers.restaurants.getRestaurantsList);
  publicRouter.get('/:restaurantId', controllers.restaurants.getRestaurant);
  publicRouter.get(
    '/:restaurantId/reviews',
    controllers.reviews.getListForRestaurant,
  );

  const privateRouter = express.Router();
  privateRouter.use(middlewares.authenticated);
  privateRouter.post(
    '/:restaurantId/reviews',
    controllers.reviews.createForRestaurant,
  );

  const privateAdminRouter = express.Router();
  privateAdminRouter.use(
    middlewares.authenticated,
    middlewares.onlyAdminAuthorized,
  );
  privateAdminRouter.post('/', controllers.restaurants.createRestaurant);
  privateAdminRouter.put(
    '/:restaurantId',
    controllers.restaurants.updateRestaurant,
  );

  return {
    publicRouter: publicRouter,
    privateRouter: privateRouter,
    adminRouter: privateAdminRouter,
  };
};
