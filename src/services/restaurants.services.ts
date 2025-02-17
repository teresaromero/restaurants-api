import { Restaurant, type Prisma as type, $Enums } from '@prisma/client';
import {
  RestaurantWithOperatingHours,
  RestaurantWithOperatingHoursList,
} from '../types';
import { RestaurantList, RestaurantItem } from '../types/response';

interface RestaurantsRepository {
  getById(id: number): Promise<RestaurantWithOperatingHours | null>;
  list(): Promise<RestaurantWithOperatingHoursList>;
  create(data: type.RestaurantCreateInput): Promise<Restaurant>;
  update(id: number, data: type.RestaurantUpdateInput): Promise<Restaurant>;
}

export const NewRestaurantsServices = (
  restaurantRepository: RestaurantsRepository,
) => {
  return {
    list: getRestaurantList(restaurantRepository),
    getById: getById(restaurantRepository),
    create: createRestaurant(restaurantRepository),
    update: updateRestaurant(restaurantRepository),
  };
};

const getRestaurantList =
  (restaurantRepository: RestaurantsRepository) =>
  async (): Promise<RestaurantList> => {
    const restaurants = await restaurantRepository.list();
    return restaurants.map(convertRestaurantToItem);
  };

const getById =
  (restaurantRepository: RestaurantsRepository) =>
  async (id: number): Promise<RestaurantItem | null> => {
    const restaurant = await restaurantRepository.getById(id);
    if (!restaurant) {
      return null;
    }
    return convertRestaurantToItem(restaurant);
  };
const createRestaurant =
  (restaurantRepository: RestaurantsRepository) =>
  async (data: type.RestaurantCreateInput) => {
    return restaurantRepository.create(data);
  };
const updateRestaurant =
  (restaurantRepository: RestaurantsRepository) =>
  async (id: number, data: type.RestaurantUpdateInput) => {
    return restaurantRepository.update(id, data);
  };

const convertRestaurantToItem = (
  restaurant: RestaurantWithOperatingHours,
): RestaurantItem => {
  return {
    id: restaurant.id,
    name: restaurant.name,
    cuisine_type: restaurant.cuisine_type || '',
    neighborhood: restaurant.neighborhood || '',
    address: restaurant.address || '',
    photograph: restaurant.photograph || '',
    lat: restaurant.lat || 0,
    lng: restaurant.lng || 0,
    image: restaurant.image || '',
    operating_hours: restaurant.operating_hours.map(({ day, hours }) => {
      return {
        day: (day as $Enums.Weekday).toString(),
        hours,
      };
    }),
  };
};
