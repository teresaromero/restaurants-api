import express, { RequestHandler, Request, Response } from 'express';

interface ReviewsController {
  getReviewsByUserId: (req: Request, res: Response) => Promise<void>;
  updateUserReview: (req: Request, res: Response) => Promise<void>;
  deleteUserReview: (req: Request, res: Response) => Promise<void>;
}

interface FavoriteController {
  createForUser: (req: Request, res: Response) => Promise<void>;
  deleteForUser: (req: Request, res: Response) => Promise<void>;
}

interface RestaurantController {
  getFavoritesForUser: (req: Request, res: Response) => Promise<void>;
}

interface UserController {
  getUser: (req: Request, res: Response) => Promise<void>;
}

interface Middlewares {
  authenticated: RequestHandler;
}

interface Controllers {
  restaurants: RestaurantController;
  reviews: ReviewsController;
  favorites: FavoriteController;
  user: UserController;
}

export const NewMeRouter = (
  middlewares: Middlewares,
  controllers: Controllers,
): express.Router => {
  const privateRouter = express.Router();
  privateRouter.use(middlewares.authenticated);

  privateRouter.get('/', controllers.user.getUser);
  // user reviews
  privateRouter.get('/reviews', controllers.reviews.getReviewsByUserId);
  privateRouter.put('/reviews/:id', controllers.reviews.updateUserReview);
  privateRouter.delete('/reviews/:id', controllers.reviews.deleteUserReview);

  // user favourites
  privateRouter.get('/favorites', controllers.restaurants.getFavoritesForUser);
  privateRouter.post(
    '/favorites/:restaurantId',
    controllers.favorites.createForUser,
  );
  privateRouter.delete(
    '/favorites/:restaurantId',
    controllers.favorites.deleteForUser,
  );

  return privateRouter;
};
