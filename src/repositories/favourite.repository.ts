import { type Prisma as type } from '@prisma/client';
import { Favorite } from '../types/models';

export const NewFavouriteRepository = (
  favoriteClient: type.FavoriteDelegate,
) => {
  return {
    createForUser: createForUser(favoriteClient),
    deleteForUser: deleteForUser(favoriteClient),
  };
};

const deleteForUser =
  (favoriteClient: type.FavoriteDelegate) =>
  async (payload: Favorite): Promise<void> => {
    await favoriteClient.delete({
      where: {
        user_id_restaurant_id: {
          user_id: payload.userId,
          restaurant_id: payload.restaurantId,
        },
      },
    });
  };

const createForUser =
  (favoriteClient: type.FavoriteDelegate) =>
  async (payload: Favorite): Promise<void> => {
    await favoriteClient.create({
      data: {
        user_id: payload.userId,
        restaurant_id: payload.restaurantId,
      },
    });
  };
