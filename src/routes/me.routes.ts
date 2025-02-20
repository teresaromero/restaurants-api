import express, { RequestHandler, Request, Response } from 'express';

interface ReviewsController {
  getReviewsByUserId: (req: Request, res: Response) => Promise<void>;
  updateUserReview: (req: Request, res: Response) => Promise<void>;
  deleteUserReview: (req: Request, res: Response) => Promise<void>;
}

interface FavoriteController {
  getUserFavorites: (req: Request, res: Response) => Promise<void>;
  markAsFavorite: (req: Request, res: Response) => Promise<void>;
  deleteFromFavorites: (req: Request, res: Response) => Promise<void>;
}

interface UserController {
  getUser: (req: Request, res: Response) => Promise<void>;
}

interface Middlewares {
  authenticated: RequestHandler;
}

interface Controllers {
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
  privateRouter.get('/favorites', controllers.favorites.getUserFavorites);
  privateRouter.post(
    '/favorites/:restaurantId',
    controllers.favorites.markAsFavorite,
  );
  privateRouter.delete(
    '/favorites/:restaurantId',
    controllers.favorites.deleteFromFavorites,
  );

  return privateRouter;
};
