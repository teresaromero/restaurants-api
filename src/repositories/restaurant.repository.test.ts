import { NewRestaurantRepository } from './restaurant.repository';
import { Restaurant, type Prisma as type } from '@prisma/client';

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
      const expected: Restaurant = {
        id: 1,
        name: 'Test Restaurant',
      } as Restaurant;
      restaurantClient.create.mockResolvedValue(expected);

      const result = await repository.create(input);
      expect(restaurantClient.create).toHaveBeenCalledWith({ data: input });
      expect(result).toEqual(expected);
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
      const updateData = { name: 'Updated Restaurant' };
      const expected: Restaurant = {
        id,
        name: 'Updated Restaurant',
      } as Restaurant;
      restaurantClient.update.mockResolvedValue(expected);

      const result = await repository.update(id, updateData);
      expect(restaurantClient.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      });
      expect(result).toEqual(expected);
    });

    it('should throw an error if prisma fails', async () => {
      const id = 1;
      const updateData = { name: 'Updated Restaurant' };
      const error = new Error('Prisma error');
      restaurantClient.update.mockRejectedValue(error);
      await expect(repository.update(id, updateData)).rejects.toThrow(error);
    });
  });

  describe('getById', () => {
    it('should return a restaurant when found', async () => {
      const id = 1;
      const expected: Restaurant = {
        id,
        name: 'Found Restaurant',
      } as Restaurant;
      restaurantClient.findUnique.mockResolvedValue(expected);

      const result = await repository.getById(id);
      expect(restaurantClient.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(expected);
    });

    it('should return null when restaurant is not found', async () => {
      const id = 2;
      restaurantClient.findUnique.mockResolvedValue(null);

      const result = await repository.getById(id);
      expect(restaurantClient.findUnique).toHaveBeenCalledWith({
        where: { id },
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
      const expected: Restaurant[] = [
        { id: 1, name: 'Restaurant One' } as Restaurant,
        { id: 2, name: 'Restaurant Two' } as Restaurant,
      ];
      restaurantClient.findMany.mockResolvedValue(expected);

      const result = await repository.list();
      expect(restaurantClient.findMany).toHaveBeenCalledWith({});
      expect(result).toEqual(expected);
    });
    it('should throw an error if prisma fails', async () => {
      const error = new Error('Prisma error');
      restaurantClient.findMany.mockRejectedValue(error);
      await expect(repository.list()).rejects.toThrow(error);
    });
  });
});
