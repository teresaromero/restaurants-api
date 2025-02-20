import { LoggedUser } from '../types/models';

interface UserRepository {
  findById: (id: number) => Promise<LoggedUser>;
}

export const NewUserService = (userRepository: UserRepository) => {
  return {
    getUserById: getUserById(userRepository),
  };
};

const getUserById = (userRepository: UserRepository) => async (id: number) => {
  return userRepository.findById(id);
};
