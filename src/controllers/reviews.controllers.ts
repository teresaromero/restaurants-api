import { Request, Response } from 'express';
import params from '../libs/params';
import { CreateReview, Review, ReviewList } from '../types/models';

interface ReviewService {
  getListForRestaurant: (restaurantId: number) => Promise<ReviewList>;
  createForRestaurant: (payload: CreateReview) => Promise<Review>;
}

export const NewReviewsController = (service: ReviewService) => {
  return {
    getListForRestaurant: getListForRestaurant(service),
    createForRestaurant: createForRestaurant(service),
  };
};

const getListForRestaurant =
  (services: ReviewService) => async (req: Request, res: Response) => {
    const restaurantId = params.getRestaurantId(req);
    if (!restaurantId) {
      res.status(400).send('Invalid restaurant id');
      return;
    }

    try {
      const data = await services.getListForRestaurant(restaurantId);
      // TODO: implement error handling - if no restaurant not found, but can be also no reviews wich is not an error
      res.send({ data });
    } catch {
      res.status(500).send('Error getting restaurants list');
    }
  };

const createForRestaurant =
  (services: ReviewService) => async (req: Request, res: Response) => {
    const authorId = params.getUserId(req);
    if (!authorId) {
      res.status(400).send('Invalid user id');
      return;
    }
    const restaurantId = params.getRestaurantId(req);
    if (!restaurantId) {
      res.status(400).send('Invalid restaurant id');
      return;
    }

    try {
      const payload = {
        authorId,
        restaurantId,
        ...req.body,
      };
      const data = await services.createForRestaurant(payload);
      res.send({ data });
    } catch {
      res.status(500).send('Error getting restaurants list');
    }
  };
