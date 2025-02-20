import {
  CreateReview,
  DeleteReview,
  Review,
  ReviewList,
  UpdateReview,
  UserReview,
} from '../types/models';

interface ReviewsRepository {
  getListForRestaurant: (
    restaurantId: number,
    limit?: number,
    cursorId?: number,
  ) => Promise<ReviewList>;
  createForRestaurant: (payload: CreateReview) => Promise<Review | null>;
  getReviewsByUserId: (userId: number) => Promise<UserReview[]>;
  updateReview: (payload: UpdateReview) => Promise<Review>;
  deleteReview: (payload: DeleteReview) => Promise<void>;
}

export const NewReviewsServices = (reviewsRepository: ReviewsRepository) => {
  return {
    getListForRestaurant: getListForRestaurant(reviewsRepository),
    createForRestaurant: createForRestaurant(reviewsRepository),
    getReviewsByUserId: getReviewsByUserId(reviewsRepository),
    updateReview: updateReview(reviewsRepository),
    deleteReview: deleteReview(reviewsRepository),
  };
};

const getListForRestaurant =
  (reviewsRepository: ReviewsRepository) =>
  async (restaurantId: number): Promise<ReviewList> => {
    return await reviewsRepository.getListForRestaurant(restaurantId);
  };

const createForRestaurant =
  (reviewsRepository: ReviewsRepository) =>
  async (payload: CreateReview): Promise<Review | null> => {
    return reviewsRepository.createForRestaurant(payload);
  };

const getReviewsByUserId =
  (reviewsRepository: ReviewsRepository) =>
  async (userId: number): Promise<UserReview[]> => {
    return reviewsRepository.getReviewsByUserId(userId);
  };

const updateReview =
  (reviewsRepository: ReviewsRepository) =>
  async (payload: UpdateReview): Promise<Review> => {
    return reviewsRepository.updateReview(payload);
  };

const deleteReview = (reviewsRepository: ReviewsRepository) => {
  return async (payload: DeleteReview): Promise<void> => {
    return reviewsRepository.deleteReview(payload);
  };
};
