import { NewUsersRepository } from './users.repository';
import { PrismaClient, users } from '@prisma/client';

describe('NewUsersRepository', () => {
  let prisma: PrismaClient;
  let findUniqueMock: jest.Mock;
  let usersRepository: ReturnType<typeof NewUsersRepository>;

  beforeEach(() => {
    findUniqueMock = jest.fn();
    prisma = {
      users: {
        findUnique: findUniqueMock,
      },
    } as unknown as PrismaClient;
    usersRepository = NewUsersRepository(prisma);
  });

  it('should return a user when found by email', async () => {
    const testEmail = 'test@example.com';
    const expectedUser: users = { id: 1, email: testEmail } as users;
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
