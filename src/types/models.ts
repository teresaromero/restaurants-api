export type RestaurantList = Restaurant[];

export type Restaurant = {
  id: number;
  name: string;
  neighborhood: string;
  photograph: string;
  address: string;
  lat: number | undefined;
  lng: number | undefined;
  image: string;
  cuisineType: string;
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

export type UserReview = Omit<Review, 'author'>;

export type CreateReview = {
  rating: number;
  comments?: string;
  authorId: number;
  restaurantId: number;
};

export type UpdateReview = {
  id: number;
  authorId: number;
  rating?: number;
  comments?: string;
};

export type DeleteReview = {
  id: number;
  authorId: number;
};

export type RestaurantListFilter = {
  neighborhoods?: string[];
  cuisineTypes?: string[];
  minRating?: number;
};

export type RoleEnum = 'ADMIN' | 'USER';

export type LoggedUser = {
  id: number;
  name: string;
  email: string;
  role: RoleEnum;
};
