import { Request, Response } from 'express';
import params from '../libs/params';
import { CreateReview, Review, ReviewList } from '../types/models';
import { APIError, BadRequestError, UnauthorizedError } from '../types/errors';
import status from 'http-status';

interface ReviewService {
  getListForRestaurant: (restaurantId: number) => Promise<ReviewList>;
  createForRestaurant: (payload: CreateReview) => Promise<Review | null>;
}

export const NewReviewsController = (service: ReviewService) => {
  return {
    getListForRestaurant: getListForRestaurant(service),
    createForRestaurant: createForRestaurant(service),
  };
};

const getListForRestaurant =
  (services: ReviewService) => async (req: Request, res: Response) => {
    try {
      const restaurantId = params.getRestaurantId(req);
      if (!restaurantId) {
        throw new BadRequestError('Restaurant not found');
      }

      const data = await services.getListForRestaurant(restaurantId);
      res.json({ data });
    } catch (error) {
      if (error instanceof APIError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      res
        .status(status.INTERNAL_SERVER_ERROR)
        .json({ error: 'Error fetching reviews' });
    }
  };

const createForRestaurant =
  (services: ReviewService) => async (req: Request, res: Response) => {
    try {
      const authorId = req.userId;
      if (!authorId) {
        throw new UnauthorizedError();
      }
      const restaurantId = params.getRestaurantId(req);
      if (!restaurantId) {
        throw new BadRequestError('Restaurant not found');
      }

      const payload = {
        authorId,
        restaurantId,
        ...req.body,
      };
      const data = await services.createForRestaurant(payload);
      if (!data) {
        throw new BadRequestError('Restaurant not found');
      }
      res.json({ data });
    } catch (error) {
      if (error instanceof APIError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      res.status(500).json('Error creating review');
    }
  };
