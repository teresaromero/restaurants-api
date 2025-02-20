import status from 'http-status';
import { APIError, BadRequestError, UnauthorizedError } from '../types/errors';
import { Favorite } from '../types/models';
import { Request, Response } from 'express';

interface FavoriteService {
  deleteForUser: (payload: Favorite) => Promise<void>;
  createForUser: (payload: Favorite) => Promise<void>;
}

export const NewFavoriteController = (service: FavoriteService) => {
  return {
    deleteForUser: deleteForUser(service),
    createForUser: createForUser(service),
  };
};

const deleteForUser =
  (service: FavoriteService) => async (req: Request, res: Response) => {
    try {
      const { userId } = req;
      if (!userId) {
        throw new UnauthorizedError();
      }
      const { restaurantId } = req.params;
      if (!restaurantId || isNaN(parseInt(restaurantId))) {
        throw new BadRequestError('Invalid restaurant id');
      }

      await service.deleteForUser({
        userId,
        restaurantId: parseInt(restaurantId),
      });
    } catch (error) {
      if (error instanceof APIError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      res
        .status(status.INTERNAL_SERVER_ERROR)
        .json({ error: 'Error deleting restaurant' });
    }
  };

const createForUser =
  (service: FavoriteService) => async (req: Request, res: Response) => {
    try {
      const { userId } = req;
      if (!userId) {
        throw new UnauthorizedError();
      }
      const { restaurantId } = req.params;
      if (!restaurantId || isNaN(parseInt(restaurantId))) {
        throw new BadRequestError('Invalid restaurant id');
      }

      await service.createForUser({
        userId,
        restaurantId: parseInt(restaurantId),
      });
    } catch (error) {
      if (error instanceof APIError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      res
        .status(status.INTERNAL_SERVER_ERROR)
        .json({ error: 'Error deleting restaurant' });
    }
  };
