import { Request, Response } from 'express';
import params from '../libs/params';
import {
  CreateRestaurant,
  Restaurant,
  RestaurantList,
  UpdateRestaurant,
} from '../types/models';
import { NotFoundError } from '../types/errors';
interface RestaurantService {
  list: () => Promise<RestaurantList>;
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
  (service: RestaurantService) => async (_req: Request, res: Response) => {
    try {
      const data = await service.list();
      res.send({ data });
    } catch {
      res.status(500).send({ error: 'Error getting restaurants list' });
    }
  };

const getRestaurant =
  (service: RestaurantService) => async (req: Request, res: Response) => {
    const restaurantId = params.getRestaurantId(req);
    if (!restaurantId) {
      res.status(400).send('Invalid restaurant id');
      return;
    }

    try {
      const data = await service.getById(restaurantId);
      res.send({ data });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(error.statusCode).send({ error: error.message });
        return;
      }
      res.status(500).send({ error: 'Error getting restaurant' });
    }
  };

const createRestaurant =
  (service: RestaurantService) => async (req: Request, res: Response) => {
    if (!params.isAuthAdmin(req)) {
      res.status(401).send('Unauthorized');
      return;
    }
    if (!params.hasRequiredFields(req, ['name'])) {
      res.status(400).send('Name is required');
      return;
    }

    try {
      const payload = req.body as CreateRestaurant;
      const data = await service.create(payload);
      res.status(201).send({ data });
    } catch {
      res.status(500).send({ error: 'Error creating restaurant' });
    }
  };

const updateRestaurant =
  (service: RestaurantService) => async (req: Request, res: Response) => {
    if (!params.isAuthAdmin(req)) {
      res.status(401).send('Unauthorized');
      return;
    }
    const restaurantId = params.getRestaurantId(req);
    if (!restaurantId) {
      res.status(400).send('Invalid restaurant id');
      return;
    }

    try {
      const payload = {
        id: restaurantId,
        ...req.body,
      };

      const data = await service.update(payload);
      res.send(data);
    } catch {
      res.status(500).send({ error: 'Error updating restaurant' });
    }
  };
