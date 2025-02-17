import { Request, Response } from 'express';
import { Restaurant, type Prisma as type } from '@prisma/client';
import params from '../libs/params';
interface RestaurantService {
  list: () => Promise<Restaurant[]>;
  getById: (id: number) => Promise<Restaurant | null>;
  create: (data: type.RestaurantCreateInput) => Promise<Restaurant>;
  update: (id: number, data: type.RestaurantUpdateInput) => Promise<Restaurant>;
}

export const NewRestaurantsController = (service: RestaurantService) => {
  return {
    getRestaurantsList: getRestaurantsList(service),
    getRestaurant: getRestaurant(service),
    createRestaurant: createRestaurant(service),
    updateRestaurant: updateRestaurant(service),
  };
};

const getRestaurantsList =
  (service: RestaurantService) => async (_req: Request, res: Response) => {
    try {
      const data = service.list();
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
      const data = service.getById(restaurantId);
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
