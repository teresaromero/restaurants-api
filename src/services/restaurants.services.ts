import { NotFoundError } from '../types/errors';
import {
  CreateRestaurant,
  Restaurant,
  RestaurantListFilter,
  UpdateRestaurant,
} from '../types/models';
import { PaginatedResponse } from '../types/pagination';

interface RestaurantsRepository {
  getById(id: number): Promise<Restaurant | null>;
  list(
    filter: RestaurantListFilter,
    limit: number,
    next?: number,
  ): Promise<PaginatedResponse<Restaurant>>;
  create(payload: CreateRestaurant): Promise<Restaurant>;
  update(payload: UpdateRestaurant): Promise<Restaurant>;
  delete(id: number): Promise<void>;
}

export const NewRestaurantsServices = (
  restaurantRepository: RestaurantsRepository,
) => {
  return {
    list: getRestaurantList(restaurantRepository),
    getById: getById(restaurantRepository),
    create: createRestaurant(restaurantRepository),
    update: updateRestaurant(restaurantRepository),
    delete: deleteRestaurant(restaurantRepository),
  };
};

const deleteRestaurant =
  (restaurantRepository: RestaurantsRepository) => async (id: number) => {
    return restaurantRepository.delete(id);
  };

const getRestaurantList =
  (restaurantRepository: RestaurantsRepository) =>
  async (
    filter: RestaurantListFilter,
    limit: number,
    next?: number,
  ): Promise<PaginatedResponse<Restaurant>> => {
    return restaurantRepository.list(filter, limit, next);
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
