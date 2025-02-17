import {
  Favorite,
  OperatingHour,
  Restaurant,
  Review,
  type Prisma as type,
} from '@prisma/client';

export type LoginEmailPasswordInput = {
  email: string;
  password: string;
};

export type TokenClaims = {
  userId: string;
  role: string;
};

export type CustomReview = Omit<
  Review,
  'user_id' | 'restaurant_id' | 'created_at'
> & {
  user: { name: string };
  restaurant: { name: string };
};

export type CustomReviewInput = Omit<
  type.ReviewCreateInput,
  'user' | 'restaurant'
>;

export type CustomRestaurant = Restaurant & {
  operating_hours: OperatingHour[];
  favorites: Favorite[];
};

export type RestaurantWithOperatingHours = Restaurant & {
  operating_hours: OperatingHour[];
};

export type RestaurantWithOperatingHoursList = RestaurantWithOperatingHours[];
