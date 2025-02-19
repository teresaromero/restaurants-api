import { CreateReview } from '../types/models';
import { NewReviewRepository } from './review.repository';
import {
  $Enums,
  Restaurant,
  Review,
  User,
  type Prisma as type,
} from '@prisma/client';

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
      const mockReviews: (Review & { restaurant: Restaurant; user: User })[] = [
        {
          id: 1,
          rating: 5,
          comments: 'Excellent!',
          restaurant_id: restaurantId,
          user_id: 1,
          created_at: new Date(),
          restaurant: { name: 'Test Restaurant', id: 1 } as Restaurant,
          user: {
            id: 1,
            name: 'Test User',
            password: '',
            email: '',
            role: $Enums.Role.USER,
            created_at: new Date(),
          } as User,
        },
      ];
      reviewClient.findMany.mockResolvedValue(mockReviews);

      const reviews = await repository.getListForRestaurant(restaurantId);

      expect(reviewClient.findMany).toHaveBeenCalledWith({
        where: { restaurant_id: restaurantId },
        include: { user: true, restaurant: true },
        orderBy: { rating: 'desc' },
      });
      expect(reviews).toEqual([
        {
          id: 1,
          rating: 5,
          comments: 'Excellent!',
          restaurantId: 1,
          author: 'Test User',
          date: mockReviews[0].created_at.toISOString(),
        },
      ]);
    });

    it('should return an empty list if no reviews are found', async () => {
      const restaurantId = 1;
      reviewClient.findMany.mockResolvedValue([]);

      const reviews = await repository.getListForRestaurant(restaurantId);

      expect(reviewClient.findMany).toHaveBeenCalledWith({
        where: { restaurant_id: restaurantId },
        include: { user: true, restaurant: true },
        orderBy: { rating: 'desc' },
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
      const inputData: type.ReviewCreateInput = {
        rating: 4,
        comments: 'Great spot!',
        user: { connect: { id: authorId } },
        restaurant: { connect: { id: restaurantId } },
      };
      const createdReview = {
        id: 1,
        restaurant_id: restaurantId,
        user_id: authorId,
        rating: inputData.rating,
        comments: inputData.comments || null,
        created_at: new Date(),
        restaurant: { id: restaurantId } as Restaurant,
        user: {
          id: authorId,
          name: 'Test User',
          password: '',
          email: '',
          role: $Enums.Role.USER,
          created_at: new Date(),
        } as User,
      };

      reviewClient.create.mockResolvedValue(createdReview);
      const review = await repository.createForRestaurant({
        authorId,
        restaurantId,
        rating: 4,
        comments: 'Great spot!',
      });

      expect(reviewClient.create).toHaveBeenCalledWith({
        data: {
          ...inputData,
          user: { connect: { id: authorId } },
          restaurant: { connect: { id: restaurantId } },
        },
        include: { restaurant: true, user: true },
      });
      expect(review).toEqual({
        author: 'Test User',
        comments: 'Great spot!',
        date: createdReview.created_at.toISOString(),
        id: 1,
        rating: 4,
        restaurantId: 1,
      });
    });

    it('should return null if review creating fails', async () => {
      const authorId = 2;
      const restaurantId = 1;
      const inputData: CreateReview = {
        authorId,
        restaurantId,
        rating: 4,
        comments: 'Great spot!',
      };
      const error = new Error('Prisma error');
      reviewClient.create.mockRejectedValue(error);

      const response = await repository.createForRestaurant(inputData);
      expect(response).toBeNull();
    });
  });
});
