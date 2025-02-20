import { Favorite } from '../types/models';

interface FavoriteRepository {
  deleteForUser: (payload: Favorite) => Promise<void>;
  createForUser: (payload: Favorite) => Promise<void>;
}

export const NewFavoriteService = (repository: FavoriteRepository) => {
  return {
    deleteForUser: deleteForUser(repository),
    createForUser: createForUser(repository),
  };
};

const deleteForUser =
  (repository: FavoriteRepository) =>
  async (payload: Favorite): Promise<void> => {
    await repository.deleteForUser(payload);
  };

const createForUser =
  (repository: FavoriteRepository) =>
  async (payload: Favorite): Promise<void> => {
    await repository.createForUser(payload);
  };
