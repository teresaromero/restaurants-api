import { NewUsersRepository } from './user.repository';
import { User, type Prisma as type } from '@prisma/client';

describe('NewUsersRepository', () => {
  let userClient: jest.Mocked<type.UserDelegate>;
  let findUniqueMock: jest.Mock;
  let createMock: jest.Mock;
  let usersRepository: ReturnType<typeof NewUsersRepository>;

  beforeEach(() => {
    findUniqueMock = jest.fn();
    createMock = jest.fn();
    userClient = {
      findUnique: findUniqueMock,
      create: createMock,
    } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    usersRepository = NewUsersRepository(userClient);
  });

  describe('findByEmail', () => {
    it('should return a user when found by email', async () => {
      const testEmail = 'test@example.com';
      const expectedUser: User = { id: 1, email: testEmail } as User;
      findUniqueMock.mockResolvedValue(expectedUser);

      const result = await usersRepository.findByEmail(testEmail);
      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { email: testEmail },
      });
      expect(result).toEqual(expectedUser);
    });

    it('should return null when no user is found', async () => {
      const testEmail = 'nonexistent@example.com';
      findUniqueMock.mockResolvedValue(null);

      const result = await usersRepository.findByEmail(testEmail);
      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { email: testEmail },
      });
      expect(result).toBeNull();
    });

    it('should throw an error if prisma fails', async () => {
      const testEmail = 'fail@example.com';
      const error = new Error('Prisma error');
      findUniqueMock.mockRejectedValue(error);

      await expect(usersRepository.findByEmail(testEmail)).rejects.toThrow(
        'Prisma error',
      );
    });
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const userData = { email: 'new@example.com' } as type.UserCreateInput;
      const createdUser: User = {
        id: 2,
        email: 'new@example.com',
        created_at: new Date(),
      } as User;
      createMock.mockResolvedValue(createdUser);

      const result = await usersRepository.create(userData);
      expect(createMock).toHaveBeenCalledWith({
        data: userData,
      });
      expect(result).toEqual(createdUser);
    });

    it('should throw an error if prisma create fails', async () => {
      const userData = { email: 'error@example.com' } as type.UserCreateInput;
      const error = new Error('Create failed');
      createMock.mockRejectedValue(error);

      await expect(usersRepository.create(userData)).rejects.toThrow(
        'Create failed',
      );
    });
  });
});
