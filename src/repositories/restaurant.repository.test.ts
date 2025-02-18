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
      expect(restaurantClient.create).toHaveBeenCalledWith({ data: input });
      expect(result).toEqual({
        id: 1,
        name: 'Test Restaurant',
        openingHours: [],
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
      const id = 1;
      const updateData = { id: 1, name: 'Updated Restaurant' };
      const expected = {
        id,
        name: 'Updated Restaurant',
        operating_hours: [],
      } as RestaurantData & { operating_hours: [] };
      restaurantClient.update.mockResolvedValue(expected);

      const result = await repository.update(updateData);
      expect(restaurantClient.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      });
      expect(result).toEqual({
        id,
        name: 'Updated Restaurant',
        openingHours: [],
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
        id,
        name: 'Found Restaurant',
        openingHours: [],
      });
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
    it('should return list of restaurants', async () => {
      const expected: RestaurantData[] = [
        {
          id: 1,
          name: 'Restaurant One',
          operating_hours: [],
        } as RestaurantData & {
          operating_hours: [];
        },
        {
          id: 2,
          name: 'Restaurant Two',
          operating_hours: [],
        } as RestaurantData & {
          operating_hours: [];
        },
      ];
      restaurantClient.findMany.mockResolvedValue(expected);

      const result = await repository.list();
      expect(restaurantClient.findMany).toHaveBeenCalledWith({
        include: { operating_hours: true },
        orderBy: { id: 'asc' },
      });
      expect(result).toEqual([
        { id: 1, name: 'Restaurant One', openingHours: [] },
        { id: 2, name: 'Restaurant Two', openingHours: [] },
      ]);
    });
    it('should throw an error if prisma fails', async () => {
      const error = new Error('Prisma error');
      restaurantClient.findMany.mockRejectedValue(error);
      await expect(repository.list()).rejects.toThrow(error);
    });
  });
});
