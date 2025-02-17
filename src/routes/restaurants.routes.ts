import express, { RequestHandler, Request, Response } from 'express';

interface Middlewares {
  authenticated: RequestHandler;
  onlyAdminAuthorized: RequestHandler;
}

interface RestaurantsController {
  getRestaurantsList: (req: Request, res: Response) => Promise<void>;
  getRestaurantById: (req: Request, res: Response) => Promise<void>;
  getReviewsForRestaurantId: (req: Request, res: Response) => Promise<void>;
  createRestaurant: (req: Request, res: Response) => Promise<void>;
  updateRestaurantById: (req: Request, res: Response) => Promise<void>;
  createReviewForRestaurantId: (req: Request, res: Response) => Promise<void>;
}

export const NewRestaurantsRouter = (
  middlewares: Middlewares,
  restaurantController: RestaurantsController,
): express.Router => {
  const restaurantsRouter = express.Router();

  const publicRouter = express.Router();
  publicRouter.get('/', restaurantController.getRestaurantsList);
  publicRouter.get('/:id', restaurantController.getRestaurantById);
  publicRouter.get(
    '/:id/reviews',
    restaurantController.getReviewsForRestaurantId,
  );
  restaurantsRouter.use(publicRouter);

  const privateAdminRouter = express.Router();
  privateAdminRouter.use(
    middlewares.authenticated,
    middlewares.onlyAdminAuthorized,
  );
  privateAdminRouter.post('/', restaurantController.createRestaurant);
  privateAdminRouter.put('/:id', restaurantController.updateRestaurantById);
  privateAdminRouter.post(
    '/:id/reviews',
    restaurantController.createReviewForRestaurantId,
  );
  restaurantsRouter.use(privateAdminRouter);

  return restaurantsRouter;
};
