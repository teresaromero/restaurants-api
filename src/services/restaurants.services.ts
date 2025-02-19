import { NotFoundError } from '../types/errors';
import {
  CreateRestaurant,
  Restaurant,
  UpdateRestaurant,
} from '../types/models';
import { PaginatedResponse } from '../types/pagination';

interface RestaurantsRepository {
  getById(id: number): Promise<Restaurant | null>;
  list(limit: number, next?: number): Promise<PaginatedResponse<Restaurant>>;
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
  async (
    limit: number,
    next?: number,
  ): Promise<PaginatedResponse<Restaurant>> => {
    return restaurantRepository.list(limit, next);
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
