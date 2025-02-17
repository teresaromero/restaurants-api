import { Review } from '@prisma/client';
import { CustomReviewInput } from '../types';

interface ReviewsRepository {
  getListForRestaurant: (restaurantId: number) => Promise<Review[]>;
  createForRestaurant: (
    author_id: number,
    restaurantId: number,
    data: CustomReviewInput,
  ) => Promise<Review>;
}

export const NewReviewsServices = (reviewsRepository: ReviewsRepository) => {
  return {
    getListForRestaurant: getListForRestaurant(reviewsRepository),
    createForRestaurant: createForRestaurant(reviewsRepository),
  };
};

const getListForRestaurant =
  (reviewsRepository: ReviewsRepository) => async (restaurantId: number) => {
    return reviewsRepository.getListForRestaurant(restaurantId);
  };

const createForRestaurant =
  (reviewsRepository: ReviewsRepository) =>
  async (authorId: number, restaurantId: number, data: CustomReviewInput) => {
    return reviewsRepository.createForRestaurant(authorId, restaurantId, data);
  };
