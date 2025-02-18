import { CreateReview, Review, ReviewList } from '../types/models';

interface ReviewsRepository {
  getListForRestaurant: (
    restaurantId: number,
    limit?: number,
    cursorId?: number,
  ) => Promise<ReviewList>;
  createForRestaurant: (payload: CreateReview) => Promise<Review>;
}

export const NewReviewsServices = (reviewsRepository: ReviewsRepository) => {
  return {
    getListForRestaurant: getListForRestaurant(reviewsRepository),
    createForRestaurant: createForRestaurant(reviewsRepository),
  };
};

const getListForRestaurant =
  (reviewsRepository: ReviewsRepository) =>
  async (restaurantId: number): Promise<ReviewList> => {
    return await reviewsRepository.getListForRestaurant(restaurantId);
  };

const createForRestaurant =
  (reviewsRepository: ReviewsRepository) =>
  async (payload: CreateReview): Promise<Review> => {
    return reviewsRepository.createForRestaurant(payload);
  };
