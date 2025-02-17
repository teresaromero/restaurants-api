import { Review, type Prisma as type } from '@prisma/client';
import { CustomReviewInput } from '../types';

export const NewReviewRepository = (reviewClient: type.ReviewDelegate) => {
  return {
    getListForRestaurant: getListForRestaurant(reviewClient),
    createForRestaurant: createForRestaurant(reviewClient),
  };
};

const getListForRestaurant =
  (reviewClient: type.ReviewDelegate) =>
  async (restaurantId: number): Promise<Review[]> => {
    return reviewClient.findMany({
      where: { restaurant_id: restaurantId },
    });
  };

const createForRestaurant =
  (reviewClient: type.ReviewDelegate) =>
  async (
    authorId: number,
    restaurantId: number,
    data: CustomReviewInput,
  ): Promise<Review> => {
    const review: type.ReviewCreateInput = {
      ...data,
      user: { connect: { id: authorId } },
      restaurant: { connect: { id: restaurantId } },
    };
    return reviewClient.create({
      data: review,
      include: { restaurant: true, user: true },
    });
  };
