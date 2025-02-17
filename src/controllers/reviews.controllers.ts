import { Request, Response } from 'express';
import { CustomReviewInput } from '../types';
import params from '../libs/params';
import { Review } from '@prisma/client';

interface ReviewService {
  getListForRestaurant: (restaurantId: number) => Promise<Review[]>;
  createForRestaurant: (
    authorId: number,
    restaurantId: number,
    data: CustomReviewInput,
  ) => Promise<Review>;
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
      const list = services.getListForRestaurant(restaurantId);
      res.send(list);
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
      const payload = req.body as CustomReviewInput;
      const list = services.createForRestaurant(
        authorId,
        restaurantId,
        payload,
      );
      res.send(list);
    } catch {
      res.status(500).send('Error getting restaurants list');
    }
  };
