import { Request, Response } from 'express';
import params from '../libs/params';
import {
  CreateReview,
  DeleteReview,
  Review,
  ReviewList,
  UpdateReview,
  UserReview,
} from '../types/models';
import { APIError, BadRequestError, UnauthorizedError } from '../types/errors';
import status from 'http-status';

interface ReviewService {
  getListForRestaurant: (restaurantId: number) => Promise<ReviewList>;
  createForRestaurant: (payload: CreateReview) => Promise<Review | null>;
  getReviewsByUserId: (userId: number) => Promise<UserReview[]>;
  updateReview: (payload: UpdateReview) => Promise<Review>;
  deleteReview: (payload: DeleteReview) => Promise<void>;
}

export const NewReviewsController = (service: ReviewService) => {
  return {
    getListForRestaurant: getListForRestaurant(service),
    createForRestaurant: createForRestaurant(service),
    getReviewsByUserId: getReviewsByUserId(service),
    updateUserReview: updateUserReview(service),
    deleteUserReview: deleteUserReview(service),
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

const getReviewsByUserId =
  (services: ReviewService) => async (req: Request, res: Response) => {
    try {
      const { userId } = req;
      if (!userId) {
        throw new UnauthorizedError();
      }
      const data = await services.getReviewsByUserId(userId);
      res.json({ data });
    } catch (error) {
      if (error instanceof APIError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      res.status(500).json('Error fetching reviews');
    }
  };

const updateUserReview =
  (services: ReviewService) => async (req: Request, res: Response) => {
    try {
      const authorId = req.userId;
      if (!authorId) {
        throw new UnauthorizedError();
      }
      const reviewId = req.params.id;
      if (!reviewId || isNaN(parseInt(reviewId))) {
        throw new BadRequestError('Review not found');
      }
      const payload: UpdateReview = {
        id: parseInt(reviewId),
        authorId,
        rating: req.body.rating ? parseInt(req.body.rating) : undefined,
        comments: req.body.comments ? req.body.comments : undefined,
      };
      const data = await services.updateReview(payload);
      res.json({ data });
    } catch (error) {
      if (error instanceof APIError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      res.status(500).json('Error updating review');
    }
  };

const deleteUserReview =
  (services: ReviewService) => async (req: Request, res: Response) => {
    try {
      const authorId = req.userId;
      if (!authorId) {
        throw new UnauthorizedError();
      }
      const reviewId = req.params.id;
      if (!reviewId || isNaN(parseInt(reviewId))) {
        throw new BadRequestError('Review not found');
      }
      await services.deleteReview({ id: parseInt(reviewId), authorId });
      res.json({ message: 'Review deleted' });
    } catch (error) {
      if (error instanceof APIError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      res.status(500).json('Error deleting review');
    }
  };
