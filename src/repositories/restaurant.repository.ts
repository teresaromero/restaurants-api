import { Restaurant, type Prisma as type } from '@prisma/client';

export const NewRestaurantRepository = (
  restaurantClient: type.RestaurantDelegate,
) => {
  return {
    list: list(restaurantClient),
    getById: getById(restaurantClient),
    create: create(restaurantClient),
    update: update(restaurantClient),
  };
};

const create =
  (restaurantClient: type.RestaurantDelegate) =>
  async (data: type.RestaurantCreateInput): Promise<Restaurant> => {
    return restaurantClient.create({
      data,
    });
  };

const update =
  (restaurantClient: type.RestaurantDelegate) =>
  async (id: number, data: type.RestaurantUpdateInput): Promise<Restaurant> => {
    return restaurantClient.update({
      where: { id },
      data,
    });
  };

const getById =
  (restaurantClient: type.RestaurantDelegate) =>
  async (id: number): Promise<Restaurant | null> => {
    return restaurantClient.findUnique({
      where: { id },
    });
  };

const list =
  (restaurantClient: type.RestaurantDelegate) =>
  async (): Promise<Restaurant[]> => {
    return restaurantClient.findMany({});
  };
