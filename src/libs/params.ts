import { Request } from 'express';

const getRestaurantId = (req: Request): number | null => {
  const { restaurantId } = req.params;
  const id = parseInt(restaurantId, 10);
  if (isNaN(id)) {
    return null;
  }
  return id;
};

const isAuthAdmin = (req: Request): boolean => {
  const { userId, userRole } = req;

  // TODO: use User model with RoleEnum
  return !!userId && userRole === 'ADMIN';
};

const hasRequiredFields = (req: Request, fields: string[]): boolean => {
  for (const field of fields) {
    if (!req.body[field] || req.body[field] == '') {
      return false;
    }
  }
  return true;
};

export default {
  getRestaurantId,
  isAuthAdmin,
  hasRequiredFields,
};
