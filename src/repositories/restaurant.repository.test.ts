import { faker } from '@faker-js/faker/.';
import { Restaurant, UpdateRestaurant } from '../types/models';
import { NewRestaurantRepository } from './restaurant.repository';
import {
  Restaurant as RestaurantData,
  type Prisma as type,
} from '@prisma/client';

describe('RestaurantRepository', () => {
  let restaurantClient: jest.Mocked<type.RestaurantDelegate>;
  let createMock: jest.Mock;
  let updateMock: jest.Mock;
  let findUniqueMock: jest.Mock;
  let findManyMock: jest.Mock;

  const emptyRestaurant: Omit<Restaurant, 'id' | 'name'> = {
    address: '',
    neighborhood: '',
    photograph: '',
    lat: undefined,
    lng: undefined,
    image: '',
    cuisineType: '',
    operatingHours: [],
  };

  let repository: ReturnType<typeof NewRestaurantRepository>;

  beforeEach(() => {
    createMock = jest.fn();
    updateMock = jest.fn();
    findUniqueMock = jest.fn();
    findManyMock = jest.fn();

    restaurantClient = {
      create: createMock,
      update: updateMock,
      findUnique: findUniqueMock,
      findMany: findManyMock,
      count: jest.fn(),
    } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    repository = NewRestaurantRepository(restaurantClient);
  });

  describe('create', () => {
    it('should create a restaurant', async () => {
      const input = { name: 'Test Restaurant' };

      restaurantClient.create.mockResolvedValue({
        id: 1,
        name: 'Test Restaurant',
        operating_hours: [],
      } as RestaurantData & { operating_hours: [] });

      const result = await repository.create(input);
      expect(restaurantClient.create).toHaveBeenCalledWith({
        data: input,
        include: { operating_hours: true },
      });
      expect(result).toEqual({
        ...emptyRestaurant,
        id: 1,
        name: 'Test Restaurant',
      });
    });
    it('should throw an error if prisma fails', async () => {
      const input = { name: 'Test Restaurant' };
      const error = new Error('Prisma error');
      restaurantClient.create.mockRejectedValue(error);

      await expect(repository.create(input)).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    it('should update a restaurant', async () => {
      const payload = {
        id: 1,
        name: 'Updated Restaurant',
      } as UpdateRestaurant;

      const payloadData = {
        name: 'Updated Restaurant',
        neighborhood: undefined,
        photograph: undefined,
        address: undefined,
        lat: undefined,
        lng: undefined,
        image: undefined,
        cuisine_type: undefined,
        operating_hours: undefined,
      } as type.RestaurantUpdateInput;
      const expectedResolve = {
        id: 1,
        name: 'Updated Restaurant',
        operating_hours: [],
      } as RestaurantData & { operating_hours: [] };
      restaurantClient.update.mockResolvedValue(expectedResolve);

      const result = await repository.update(payload);
      expect(restaurantClient.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: payloadData,
        include: { operating_hours: true },
      });
      expect(result).toEqual({
        ...emptyRestaurant,
        id: 1,
        name: 'Updated Restaurant',
      });
    });

    it('should throw an error if prisma fails', async () => {
      const updateData = { id: 1, name: 'Updated Restaurant' };
      const error = new Error('Prisma error');
      restaurantClient.update.mockRejectedValue(error);
      await expect(repository.update(updateData)).rejects.toThrow(error);
    });
  });

  describe('getById', () => {
    it('should return a restaurant when found', async () => {
      const id = 1;
      const expected = {
        id,
        name: 'Found Restaurant',
        operating_hours: [],
      } as RestaurantData & { operating_hours: [] };
      restaurantClient.findUnique.mockResolvedValue(expected);

      const result = await repository.getById(id);
      expect(restaurantClient.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: { operating_hours: true },
      });
      expect(result).toEqual({
        ...emptyRestaurant,
        id,
        name: 'Found Restaurant',
      } as Restaurant);
    });

    it('should return null when restaurant is not found', async () => {
      const id = 2;
      restaurantClient.findUnique.mockResolvedValue(null);

      const result = await repository.getById(id);
      expect(restaurantClient.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: { operating_hours: true },
      });
      expect(result).toBeNull();
    });

    it('should throw an error if prisma fails', async () => {
      const id = 1;
      const error = new Error('Prisma error');
      restaurantClient.findUnique.mockRejectedValue(error);
      await expect(repository.getById(id)).rejects.toThrow(error);
    });
  });

  describe('list', () => {
    const returnedByClient: (returned: number) => RestaurantData[] = (
      returned: number,
    ) =>
      Array.from({ length: returned }).map((_, i) => ({
        id: i + 1,
        name: faker.company.name(),
        neighborhood: faker.location.zipCode(),
        photograph: faker.image.url(),
        address: faker.location.streetAddress(),
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
        image: faker.image.url(),
        cuisine_type: faker.food.ethnicCategory(),
        operating_hours: [],
      }));
    it('should return a single page list of 10 restaurants of a total 10', async () => {
      restaurantClient.findMany.mockResolvedValue(returnedByClient(10));
      restaurantClient.count.mockResolvedValue(10);

      const result = await repository.list({}, 10);
      expect(restaurantClient.findMany).toHaveBeenCalledWith({
        cursor: undefined,
        include: { operating_hours: true },
        orderBy: { name: 'asc' },
        take: 11,
        skip: 0,
      });
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveLength(10);
      expect(result.pageSize).toBe(10);
      expect(result.next).toBeUndefined();
      expect(result.total).toBe(10);
    });

    it('should return a single page list of 10 restaurants of a total 15, with defined cursor', async () => {
      restaurantClient.findMany.mockResolvedValue(returnedByClient(10 + 1));
      restaurantClient.count.mockResolvedValue(15);

      const result = await repository.list({}, 10);
      expect(restaurantClient.findMany).toHaveBeenCalledWith({
        cursor: undefined,
        include: { operating_hours: true },
        orderBy: { name: 'asc' },
        take: 11,
        skip: 0,
      });
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveLength(10);
      expect(result.pageSize).toBe(10);
      expect(result.next).toBeDefined();
      expect(result.total).toBe(15);
    });

    it('should return a single page list of 10 restaurants of a total 25, with defined cursor', async () => {
      restaurantClient.findMany.mockResolvedValue(returnedByClient(10 + 1));
      restaurantClient.count.mockResolvedValue(25);
      const limit = 10;
      const next = 10;
      const result = await repository.list({}, limit, next);
      expect(restaurantClient.findMany).toHaveBeenCalledWith({
        cursor: { id: 10 },
        include: { operating_hours: true },
        orderBy: { name: 'asc' },
        take: 11,
        skip: 1,
      });
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveLength(10);
      expect(result.pageSize).toBe(10);
      expect(result.next).toBeDefined();
      expect(result.total).toBe(25);
    });

    it('should filter by neighborhood, if provided', async () => {
      const filter = { neighborhoods: ['juslibol', 'zorongo'] };
      restaurantClient.findMany.mockResolvedValue(returnedByClient(10 + 1));
      restaurantClient.count.mockResolvedValue(25);

      await repository.list(filter, 10);
      expect(restaurantClient.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            neighborhood: {
              in: filter.neighborhoods,
            },
          },
        }),
      );
    });

    it('should filter by cusine type, if provided', async () => {
      const filter = { cuisineTypes: ['italian', 'american'] };
      restaurantClient.findMany.mockResolvedValue(returnedByClient(10 + 1));
      restaurantClient.count.mockResolvedValue(25);

      await repository.list(filter, 10);
      expect(restaurantClient.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            cuisine_type: {
              in: filter.cuisineTypes,
            },
          },
        }),
      );
    });

    it('should filter by minRating, if provided', async () => {
      const filter = { minRating: 3 };
      restaurantClient.findMany.mockResolvedValue(returnedByClient(10 + 1));
      restaurantClient.count.mockResolvedValue(25);

      await repository.list(filter, 10);
      expect(restaurantClient.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            reviews: {
              every: {
                rating: {
                  gte: filter.minRating,
                },
              },
            },
          },
        }),
      );
    });

    it('should filter by combine filters, if provided', async () => {
      const filter = {
        neighborhoods: ['juslibol'],
        cuisineTypes: ['italian'],
        minRating: 3,
      };
      restaurantClient.findMany.mockResolvedValue(returnedByClient(10 + 1));
      restaurantClient.count.mockResolvedValue(25);

      await repository.list(filter, 10);
      expect(restaurantClient.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            neighborhood: {
              in: filter.neighborhoods,
            },
            cuisine_type: {
              in: filter.cuisineTypes,
            },
            reviews: {
              every: {
                rating: {
                  gte: filter.minRating,
                },
              },
            },
          },
        }),
      );
    });

    it('should throw an error if prisma fails', async () => {
      const error = new Error('Prisma error');
      restaurantClient.findMany.mockRejectedValue(error);
      await expect(repository.list({}, 10)).rejects.toThrow(error);
    });
  });
});
