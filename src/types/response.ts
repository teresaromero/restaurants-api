export type RestaurantList = RestaurantItem[];

export type RestaurantItem = {
  id: number;
  name: string;
  neighborhood?: string;
  photograph?: string;
  address?: string;
  lat?: number;
  lng?: number;
  image?: string;
  cuisine_type?: string;
  operating_hours?: OperatingHour[];
};

export type OperatingHour = {
  day: string;
  hours: string;
};

export type ReviewList = ReviewItem[];

export type ReviewItem = {
  date: string;
  rating: number;
  comments: string;
};
