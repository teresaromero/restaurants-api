import { Request, Response } from 'express';
import { Restaurant, type Prisma as type } from '@prisma/client';
import params from '../libs/params';
import { RestaurantItem, RestaurantList } from '../types/response';
interface RestaurantService {
  list: () => Promise<RestaurantList>;
  getById: (id: number) => Promise<RestaurantItem | null>;
  create: (data: type.RestaurantCreateInput) => Promise<Restaurant>;
  update: (id: number, data: type.RestaurantUpdateInput) => Promise<Restaurant>;
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
      res.status(500).send('Error getting restaurants list');
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
      if (!data) {
        res.status(404).send({ error: 'Restaurant not found' });
        return;
      }
      res.send({ data });
    } catch {
      res.status(500).send('Error getting restaurants list');
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
      const payload = req.body as type.RestaurantCreateInput;
      const data = service.create(payload);
      res.status(201).send({ data });
    } catch {
      res.status(500).send('Error getting restaurants list');
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
      const payload = req.body as type.RestaurantUpdateInput;
      const data = service.update(restaurantId, payload);
      res.send(data);
    } catch {
      res.status(500).send('Error getting restaurants list');
    }
  };
