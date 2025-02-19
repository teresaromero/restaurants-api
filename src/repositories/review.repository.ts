import { Review as ReviewData, type Prisma as type } from '@prisma/client';
import { CreateReview, Review, ReviewList } from '../types/models';

export const NewReviewRepository = (reviewClient: type.ReviewDelegate) => {
  return {
    getListForRestaurant: getListForRestaurant(reviewClient),
    createForRestaurant: createForRestaurant(reviewClient),
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
