import { $Enums, User, type Prisma as type } from '@prisma/client';
import { LoggedUser, RoleEnum } from '../types/models';
import { NotFoundError } from '../types/errors';

export const NewUsersRepository = (userClient: type.UserDelegate) => {
  return {
    findByEmail: findByEmail(userClient),
    create: create(userClient),
    findById: findById(userClient),
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

const findById =
  (userClient: type.UserDelegate) =>
  async (id: number): Promise<LoggedUser> => {
    const user = await userClient.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: enumRoleMapping[user.role],
    };
  };

const enumRoleMapping: Record<$Enums.Role, RoleEnum> = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};
