import { PrismaClient, users } from '@prisma/client';

export const NewUsersRepository = (prisma: PrismaClient) => {
  return {
    findByEmail: findByEmail(prisma),
  };
};

const findByEmail =
  (prisma: PrismaClient) =>
  async (email: string): Promise<users | null> => {
    return prisma.users.findUnique({
      where: { email },
    });
  };
