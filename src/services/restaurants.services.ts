import { NotFoundError } from '../types/errors';
import {
  CreateRestaurant,
  Restaurant,
  RestaurantList,
  UpdateRestaurant,
} from '../types/models';

interface RestaurantsRepository {
  getById(id: number): Promise<Restaurant | null>;
  list(): Promise<RestaurantList>;
  create(payload: CreateRestaurant): Promise<Restaurant>;
  update(payload: UpdateRestaurant): Promise<Restaurant>;
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
    return restaurantRepository.list();
  };

const getById =
  (restaurantRepository: RestaurantsRepository) =>
  async (id: number): Promise<Restaurant> => {
    const restaurant = await restaurantRepository.getById(id);
    if (!restaurant) {
      throw new NotFoundError(`Restaurant ${id} not found`);
    }
    return restaurant;
  };

const createRestaurant =
  (restaurantRepository: RestaurantsRepository) =>
  async (payload: CreateRestaurant) => {
    return restaurantRepository.create(payload);
  };

const updateRestaurant =
  (restaurantRepository: RestaurantsRepository) =>
  async (payload: UpdateRestaurant) => {
    return restaurantRepository.update(payload);
  };
