import { PrismaClient, users } from '@prisma/client';

export const NewUsersRepository = (prisma: PrismaClient) => {
  return {
    findByEmail: findByEmail(prisma),
    create: create(prisma),
  };
};

const findByEmail =
  (prisma: PrismaClient) =>
  async (email: string): Promise<users | null> => {
    return prisma.users.findUnique({
      where: { email },
    });
  };

const create =
  (prisma: PrismaClient) =>
  async (data: Omit<users, 'id' | 'created_at'>): Promise<users> => {
    return prisma.users.create({
      data,
    });
  };
