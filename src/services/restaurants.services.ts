import { Restaurant, type Prisma as type } from '@prisma/client';

interface RestaurantsRepository {
  getById(id: number): Promise<Restaurant | null>;
  list(): Promise<Restaurant[]>;
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
  (restaurantRepository: RestaurantsRepository) => async () => {
    return restaurantRepository.list();
  };
const getById =
  (restaurantRepository: RestaurantsRepository) => async (id: number) => {
    return restaurantRepository.getById(id);
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
