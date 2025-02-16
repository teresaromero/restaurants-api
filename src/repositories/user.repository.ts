import { User, type Prisma as type } from '@prisma/client';

export const NewUsersRepository = (userClient: type.UserDelegate) => {
  return {
    findByEmail: findByEmail(userClient),
    create: create(userClient),
  };
};

const findByEmail =
  (userClient: type.UserDelegate) =>
  async (email: string): Promise<User | null> => {
    return userClient.findUnique({
      where: { email },
    });
  };

const create =
  (userClient: type.UserDelegate) =>
  async (data: type.UserCreateInput): Promise<User> => {
    return userClient.create({
      data,
    });
  };
