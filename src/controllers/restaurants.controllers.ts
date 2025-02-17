import { Request, Response } from 'express';

export const NewRestaurantsController = () => {
  return {
    getRestaurantsList: getRestaurantsList(),
    getRestaurantById: getRestaurantById(),
    getReviewsForRestaurantId: getReviewsForRestaurantId(),
    createRestaurant: createRestaurant(),
    updateRestaurantById: updateRestaurantById(),
    createReviewForRestaurantId: createReviewForRestaurantId(),
  };
};

const getRestaurantsList = () => async (_req: Request, res: Response) => {
  res.send('Get restaurants list');
};

const getRestaurantById = () => async (_req: Request, res: Response) => {
  res.send('Get restaurant');
};

const createRestaurant = () => async (_req: Request, res: Response) => {
  res.send('Create restaurant');
};

const updateRestaurantById = () => async (_req: Request, res: Response) => {
  res.send('Update restaurant');
};

const createReviewForRestaurantId =
  () => async (_req: Request, res: Response) => {
    res.send('Create restaurant review');
  };

const getReviewsForRestaurantId =
  () => async (_req: Request, res: Response) => {
    res.send('Get restaurant reviews');
  };
