import { Review as ReviewData, type Prisma as type } from '@prisma/client';
import {
  CreateReview,
  DeleteReview,
  Review,
  ReviewList,
  UpdateReview,
  UserReview,
} from '../types/models';
import { NotFoundError } from '../types/errors';

export const NewReviewRepository = (reviewClient: type.ReviewDelegate) => {
  return {
    getListForRestaurant: getListForRestaurant(reviewClient),
    createForRestaurant: createForRestaurant(reviewClient),
    getReviewsByUserId: getReviewsByUserId(reviewClient),
    updateReview: updateReview(reviewClient),
    deleteReview: deleteReview(reviewClient),
  };
};

const getListForRestaurant =
  (reviewClient: type.ReviewDelegate) =>
  async (restaurantId: number): Promise<ReviewList> => {
    const data = await reviewClient.findMany({
      where: { restaurant_id: restaurantId },
      include: { user: true, restaurant: true },
      orderBy: { rating: 'desc' },
    });

    return data.map(translateDataToReview);
  };

const createForRestaurant =
  (reviewClient: type.ReviewDelegate) =>
  async (payload: CreateReview): Promise<Review | null> => {
    const data: type.ReviewCreateInput = {
      rating: payload.rating,
      comments: payload.comments,
      user: { connect: { id: payload.authorId } },
      restaurant: { connect: { id: payload.restaurantId } },
    };
    try {
      const review = await reviewClient.create({
        data,
        include: { restaurant: true, user: true },
      });

      return translateDataToReview(review);
    } catch {
      // TODO: log error
      return null;
    }
  };

type ReviewWithUserAndRestaurant = ReviewData & {
  user: { name: string };
  restaurant: { id: number };
};

const translateDataToReview = (data: ReviewWithUserAndRestaurant): Review => ({
  id: data.id,
  rating: data.rating,
  comments: data.comments || '',
  date: data.created_at.toISOString(),
  author: data.user.name,
  restaurantId: data.restaurant.id,
});

// TODO implement pagination
const getReviewsByUserId =
  (reviewClient: type.ReviewDelegate) =>
  async (userId: number): Promise<UserReview[]> => {
    const data = await reviewClient.findMany({
      where: { user_id: userId },
    });

    return data.map((review) => ({
      id: review.id,
      rating: review.rating,
      comments: review.comments || '',
      date: review.created_at.toISOString(),
      restaurantId: review.restaurant_id,
    }));
  };

const updateReview =
  (reviewClient: type.ReviewDelegate) =>
  async (payload: UpdateReview): Promise<Review> => {
    const updatedReview = await reviewClient.update({
      where: { id: payload.id, user_id: payload.authorId },
      data: {
        rating: payload.rating,
        comments: payload.comments,
      },
      include: { restaurant: true, user: true },
    });
    if (!updatedReview) {
      throw new NotFoundError('Review not found');
    }

    return translateDataToReview(updatedReview);
  };

const deleteReview =
  (reviewClient: type.ReviewDelegate) =>
  async (payload: DeleteReview): Promise<void> => {
    const review = reviewClient.delete({
      where: { id: payload.id, user_id: payload.authorId },
    });
    if (!review) {
      throw new NotFoundError('Review not found');
    }
  };
