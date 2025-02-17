import { Review } from '@prisma/client';
import { CustomReviewInput } from '../types';
import { ReviewItem, ReviewList } from '../types/response';

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
  (reviewsRepository: ReviewsRepository) =>
  async (restaurantId: number): Promise<ReviewList> => {
    const list = await reviewsRepository.getListForRestaurant(restaurantId);

    return list.map(convertReviewToItem);
  };

const createForRestaurant =
  (reviewsRepository: ReviewsRepository) =>
  async (
    authorId: number,
    restaurantId: number,
    data: CustomReviewInput,
  ): Promise<ReviewItem> => {
    const review = await reviewsRepository.createForRestaurant(
      authorId,
      restaurantId,
      data,
    );
    return convertReviewToItem(review);
  };

const convertReviewToItem = (review: Review): ReviewItem => {
  return {
    date: review.created_at.toISOString(),
    rating: review.rating,
    comments: review.comments || '',
  };
};
