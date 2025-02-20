import { Request, Response } from 'express';
import params from '../libs/params';
import {
  CreateRestaurant,
  Restaurant,
  RestaurantListFilter,
  UpdateRestaurant,
} from '../types/models';
import {
  APIError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../types/errors';
import status from 'http-status';
import { PaginatedResponse } from '../types/pagination';
interface RestaurantService {
  list: (
    filter: RestaurantListFilter,
    limit: number,
    next?: number,
  ) => Promise<PaginatedResponse<Restaurant>>;
  getById: (id: number) => Promise<Restaurant>;
  create: (payload: CreateRestaurant) => Promise<Restaurant>;
  update: (payload: UpdateRestaurant) => Promise<Restaurant>;
}

export const NewRestaurantsController = (service: RestaurantService) => {
  return {
    // public
    getRestaurantsList: getRestaurantsList(service),
    getRestaurant: getRestaurant(service),
    // private
    createRestaurant: createRestaurant(service),
    updateRestaurant: updateRestaurant(service),
  };
};

const getRestaurantsList =
  (service: RestaurantService) => async (req: Request, res: Response) => {
    try {
      // Default perPage to 10
      const limitParam = 10;
      const next = parseInt(req.query.next as string) || undefined;

      const filter: RestaurantListFilter = {};
      filter.neighborhoods = req.query.neighborhoods
        ? (req.query.neighborhoods as string).split(',')
        : undefined;
      filter.cuisineTypes = req.query.cuisineTypes
        ? (req.query.cuisineTypes as string).split(',')
        : undefined;
      filter.minRating = req.query.minRating
        ? parseInt(req.query.minRating as string)
        : undefined;

      const data = await service.list(filter, limitParam, next);
      res.json(data);
      return;
    } catch {
      res
        .status(status.INTERNAL_SERVER_ERROR)
        .json({ error: 'Error getting restaurants list' });
    }
  };

const getRestaurant =
  (service: RestaurantService) => async (req: Request, res: Response) => {
    const restaurantId = params.getRestaurantId(req);
    if (!restaurantId) {
      res.status(status.BAD_REQUEST).json('Invalid restaurant id');
      return;
    }

    try {
      const data = await service.getById(restaurantId);
      res.json({ data });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      res
        .status(status.INTERNAL_SERVER_ERROR)
        .json({ error: 'Error getting restaurant' });
    }
  };

const createRestaurant =
  (service: RestaurantService) => async (req: Request, res: Response) => {
    try {
      if (!params.isAuthAdmin(req)) {
        throw new UnauthorizedError();
      }
      if (!params.hasRequiredFields(req, ['name'])) {
        throw new BadRequestError('Missing required fields: [name]');
      }

      const payload = req.body as CreateRestaurant;
      const data = await service.create(payload);
      res.status(status.CREATED).json({ data });
    } catch (error) {
      if (error instanceof APIError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }

      res
        .status(status.INTERNAL_SERVER_ERROR)
        .json({ error: 'Error creating restaurant' });
    }
  };

const updateRestaurant =
  (service: RestaurantService) => async (req: Request, res: Response) => {
    try {
      if (!params.isAuthAdmin(req)) {
        throw new UnauthorizedError();
      }
      const restaurantId = params.getRestaurantId(req);
      if (!restaurantId) {
        throw new BadRequestError('Invalid restaurant id');
      }

      const payload = {
        id: restaurantId,
        ...req.body,
      };

      const data = await service.update(payload);
      res.json(data);
    } catch (error) {
      if (error instanceof APIError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      res
        .status(status.INTERNAL_SERVER_ERROR)
        .json({ error: 'Error updating restaurant' });
    }
  };
