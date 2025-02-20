import {
  Restaurant as RestaurantData,
  type Prisma as type,
  $Enums,
  Weekday,
  OperatingHour,
} from '@prisma/client';

import {
  CreateRestaurant,
  Restaurant,
  RestaurantListFilter,
  UpdateRestaurant,
  WeekdayEnum,
} from '../types/models';
import { PaginatedResponse } from '../types/pagination';

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

// create a new restaurant
// if operatingHours, the operating hours will be created
// if not, the restaurant will be created without operating hours
const create =
  (restaurantClient: type.RestaurantDelegate) =>
  async (payload: CreateRestaurant): Promise<Restaurant> => {
    const data = translateCreatePayloadToData(payload);

    const restaurant = await restaurantClient.create({
      data,
      include: {
        operating_hours: true,
      },
    });

    return translateDataToRestaurant(restaurant);
  };

// update a restaurant
// if operatingHours, the operating hours will be updated
const update =
  (restaurantClient: type.RestaurantDelegate) =>
  async (payload: UpdateRestaurant): Promise<Restaurant> => {
    const data = translateUpdatePayloadToData(payload);

    const restaurant = await restaurantClient.update({
      where: { id: payload.id },
      include: { operating_hours: true },
      data,
    });

    return translateDataToRestaurant(restaurant);
  };

// getById will return a restaurant by ID
// if the restaurant does not exist, it will return null
const getById =
  (restaurantClient: type.RestaurantDelegate) =>
  async (id: number): Promise<Restaurant | null> => {
    const restaurant = await restaurantClient.findUnique({
      where: { id },
      include: { operating_hours: true },
    });
    if (!restaurant) {
      return null;
    }

    return translateDataToRestaurant(restaurant);
  };

// list all restaurants ordered by ID
// only the first 10 restaurants will be returned by default
const list =
  (restaurantClient: type.RestaurantDelegate) =>
  async (
    filter: RestaurantListFilter,
    limit: number,
    next?: number,
  ): Promise<PaginatedResponse<Restaurant>> => {
    const whereFilter = whereRestaurantList(filter);
    const list = await restaurantClient.findMany({
      orderBy: { name: 'asc' },
      include: { operating_hours: true },
      take: limit + 1,
      skip: next ? 1 : 0,
      cursor: next ? { id: next } : undefined,
      where: whereFilter,
    });

    const hasNextPage = list.length > limit;
    // remove the last item if there is a next page
    if (hasNextPage) {
      list.pop();
    }

    const count = await restaurantClient.count();

    const data = list.map(translateDataToRestaurant);
    const pageSize = list.length;
    return {
      data: data,
      pageSize: pageSize,
      next: hasNextPage ? list[list.length - 1].id : undefined,
      total: count,
    };
  };

const payloadWeekdayMapping: Record<$Enums.Weekday, WeekdayEnum> = {
  Monday: Weekday.Monday,
  Tuesday: Weekday.Tuesday,
  Wednesday: Weekday.Wednesday,
  Thursday: Weekday.Thursday,
  Friday: Weekday.Friday,
  Saturday: Weekday.Saturday,
  Sunday: Weekday.Sunday,
};

const dataWeekdayMapping: Record<WeekdayEnum, $Enums.Weekday> = {
  Monday: Weekday.Monday,
  Tuesday: Weekday.Tuesday,
  Wednesday: Weekday.Wednesday,
  Thursday: Weekday.Thursday,
  Friday: Weekday.Friday,
  Saturday: Weekday.Saturday,
  Sunday: Weekday.Sunday,
};

const translateCreatePayloadToData = (
  payload: CreateRestaurant,
): type.RestaurantCreateInput => {
  const operatingHoursData =
    payload.operatingHours?.map(({ day, hours }) => {
      return {
        day: payloadWeekdayMapping[day],
        hours,
      };
    }) || [];

  return {
    name: payload.name,
    neighborhood: payload.neighborhood,
    photograph: payload.photograph,
    address: payload.address,
    lat: payload.lat,
    lng: payload.lng,
    image: payload.image,
    cuisine_type: payload.cuisineType,
    operating_hours:
      operatingHoursData.length > 0
        ? {
            createMany: {
              data: operatingHoursData,
            },
          }
        : undefined,
  };
};

const translateUpdatePayloadToData = (
  payload: UpdateRestaurant,
): type.RestaurantUpdateInput => {
  const operatingHoursData =
    payload.operatingHours?.map(({ id, day, hours }) => {
      return {
        id,
        day: dataWeekdayMapping[day],
        hours,
      };
    }) || [];

  return {
    name: payload.name ? payload.name : undefined,
    neighborhood: payload.neighborhood ? payload.neighborhood : undefined,
    photograph: payload.photograph ? payload.photograph : undefined,
    address: payload.address ? payload.address : undefined,
    lat: payload.lat ? payload.lat : undefined,
    lng: payload.lng ? payload.lng : undefined,
    image: payload.image ? payload.image : undefined,
    cuisine_type: payload.cuisineType ? payload.cuisineType : undefined,
    operating_hours:
      operatingHoursData.length > 0
        ? {
            updateMany: {
              data: operatingHoursData,
              where: {
                restaurant_id: payload.id,
              },
            },
          }
        : undefined,
  };
};

type RestaurantWithOperatingHours = RestaurantData & {
  operating_hours: OperatingHour[];
};

const translateDataToRestaurant = (
  data: RestaurantWithOperatingHours,
): Restaurant => {
  return {
    id: data.id,
    name: data.name,
    neighborhood: data.neighborhood || '',
    photograph: data.photograph || '',
    address: data.address || '',
    lat: data.lat || undefined,
    lng: data.lng || undefined,
    image: data.image || '',
    cuisineType: data.cuisine_type || '',
    operatingHours: data.operating_hours.map(({ id, day, hours }) => {
      return {
        id,
        day: dataWeekdayMapping[day],
        hours,
      };
    }),
  };
};

const whereRestaurantList = (
  filter: RestaurantListFilter,
): type.RestaurantWhereInput | undefined => {
  const neighborhoodFilter = filter.neighborhoods
    ? {
        in: filter.neighborhoods,
      }
    : undefined;

  const cuisineTypeFilter = filter.cuisineTypes
    ? {
        in: filter.cuisineTypes,
      }
    : undefined;

  const reviewRatingFilter = filter.minRating
    ? {
        every: {
          rating: {
            gte: filter.minRating,
          },
        },
      }
    : undefined;

  const where: type.RestaurantWhereInput = {};
  if (neighborhoodFilter) {
    where.neighborhood = neighborhoodFilter;
  }
  if (cuisineTypeFilter) {
    where.cuisine_type = cuisineTypeFilter;
  }
  if (reviewRatingFilter) {
    where.reviews = reviewRatingFilter;
  }

  return Object.keys(where).length > 0 ? where : undefined;
};
