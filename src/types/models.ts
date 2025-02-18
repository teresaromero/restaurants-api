export type RestaurantList = Restaurant[];

export type Restaurant = {
  id: number;
  name: string;
  neighborhood?: string;
  photograph?: string;
  address?: string;
  lat?: number;
  lng?: number;
  image?: string;
  cuisine_type?: string;
  operatingHours: OperatingHour[];
};

export type WeekdayEnum =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type OperatingHour = {
  id: number;
  day: WeekdayEnum;
  hours: string;
};

export type CreateOperatingHour = {
  day: WeekdayEnum;
  hours: string;
};

export type CreateRestaurant = {
  name: string;
  neighborhood?: string;
  photograph?: string;
  address?: string;
  lat?: number;
  lng?: number;
  image?: string;
  cuisineType?: string;
  operatingHours?: CreateOperatingHour[];
};

export type UpdateOperatingHour = {
  id: number;
  day: WeekdayEnum;
  hours: string;
};

export type UpdateRestaurant = {
  id: number;
  name?: string;
  neighborhood?: string;
  photograph?: string;
  address?: string;
  lat?: number;
  lng?: number;
  image?: string;
  cuisineType?: string;
  operatingHours?: UpdateOperatingHour[];
};

export type ReviewList = Review[];

export type Review = {
  id: number;
  date: string;
  rating: number;
  comments: string;
  author: string;
  restaurantId: number;
};

export type CreateReview = {
  rating: number;
  comments?: string;
  authorId: number;
  restaurantId: number;
};
