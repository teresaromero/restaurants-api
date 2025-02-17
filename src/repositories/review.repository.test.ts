import { NewReviewRepository } from './review.repository';
import { Review, type Prisma as type } from '@prisma/client';

describe('Review Repository', () => {
  let reviewClient: jest.Mocked<type.ReviewDelegate>;
  let findManyMock: jest.Mock;
  let createMock: jest.Mock;
  let repository: ReturnType<typeof NewReviewRepository>;

  beforeEach(() => {
    findManyMock = jest.fn();
    createMock = jest.fn();
    reviewClient = {
      findMany: findManyMock,
      create: createMock,
    } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    repository = NewReviewRepository(reviewClient);
  });

  describe('getListForRestaurant', () => {
    it('should return a list of reviews for a given restaurant', async () => {
      const restaurantId = 1;
      const mockReviews: Review[] = [
        {
          id: 1,
          restaurant_id: restaurantId,
          user_id: 2,
          rating: 5,
          comments: 'Excellent!',
          created_at: new Date(),
          date: new Date(),
        },
      ];
      reviewClient.findMany.mockResolvedValue(mockReviews);

      const reviews = await repository.getListForRestaurant(restaurantId);

      expect(reviewClient.findMany).toHaveBeenCalledWith({
        where: { restaurant_id: restaurantId },
      });
      expect(reviews).toEqual(mockReviews);
    });

    it('should return an empty list if no reviews are found', async () => {
      const restaurantId = 1;
      reviewClient.findMany.mockResolvedValue([]);

      const reviews = await repository.getListForRestaurant(restaurantId);

      expect(reviewClient.findMany).toHaveBeenCalledWith({
        where: { restaurant_id: restaurantId },
      });
      expect(reviews).toEqual([]);
    });

    it('should throw an error if prisma fails', async () => {
      const restaurantId = 1;
      const error = new Error('Prisma error');
      reviewClient.findMany.mockRejectedValue(error);

      await expect(
        repository.getListForRestaurant(restaurantId),
      ).rejects.toThrow('Prisma error');
    });
  });

  describe('createForRestaurant', () => {
    it('should create a review for a restaurant', async () => {
      const authorId = 2;
      const restaurantId = 1;
      const inputData = { rating: 4, comment: 'Great spot!' };
      const createdReview: Review = {
        id: 1,
        restaurant_id: restaurantId,
        user_id: authorId,
        rating: inputData.rating,
        comments: inputData.comment,
        created_at: new Date(),
        date: new Date(),
      };

      reviewClient.create.mockResolvedValue(createdReview);

      const review = await repository.createForRestaurant(
        authorId,
        restaurantId,
        inputData,
      );

      expect(reviewClient.create).toHaveBeenCalledWith({
        data: {
          ...inputData,
          user: { connect: { id: authorId } },
          restaurant: { connect: { id: restaurantId } },
        },
        include: { restaurant: true, user: true },
      });
      expect(review).toEqual(createdReview);
    });

    it('should throw an error if prisma fails', async () => {
      const authorId = 2;
      const restaurantId = 1;
      const inputData = { rating: 4, comment: 'Great spot!' };
      const error = new Error('Prisma error');
      reviewClient.create.mockRejectedValue(error);

      await expect(
        repository.createForRestaurant(authorId, restaurantId, inputData),
      ).rejects.toThrow('Prisma error');
    });
  });
});
