import { Restaurant, type Prisma as type } from '@prisma/client';
import {
  RestaurantWithOperatingHours,
  RestaurantWithOperatingHoursList,
} from '../types';

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
  async (id: number): Promise<RestaurantWithOperatingHours | null> => {
    const lola = await restaurantClient.findUnique({
      where: { id },
    });
    console.log(lola);

    const pepe = await restaurantClient.findUnique({
      where: { id },
      include: { operating_hours: true },
    });

    return pepe;
  };

const list =
  (restaurantClient: type.RestaurantDelegate) =>
  async (): Promise<RestaurantWithOperatingHoursList> => {
    return restaurantClient.findMany({
      include: { operating_hours: true },
    });
  };
