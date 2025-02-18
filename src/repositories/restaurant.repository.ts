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
  RestaurantList,
  UpdateRestaurant,
  WeekdayEnum,
} from '../types/models';

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
  async (): Promise<RestaurantList> => {
    const list = await restaurantClient.findMany({
      orderBy: { id: 'asc' },
      include: { operating_hours: true },
    });

    return list.map(translateDataToRestaurant);
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
    neighborhood: data.neighborhood || undefined,
    photograph: data.photograph || undefined,
    address: data.address || undefined,
    lat: data.lat || undefined,
    lng: data.lng || undefined,
    image: data.image || undefined,
    cuisine_type: data.cuisine_type || undefined,
    operating_hours: data.operating_hours.map(({ id, day, hours }) => {
      return {
        id,
        day: dataWeekdayMapping[day],
        hours,
      };
    }),
  };
};
