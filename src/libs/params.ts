import { Request } from 'express';

const getRestaurantId = (req: Request): number | null => {
  const { restaurantId } = req.params;
  const id = parseInt(restaurantId, 10);
  if (isNaN(id)) {
    return null;
  }
  return id;
};

const getUserId = (req: Request): number | null => {
  const { userId } = req;
  if (!userId || userId == '') {
    return null;
  }
  const id = parseInt(userId, 10);
  if (isNaN(id)) {
    return null;
  }
  return id;
};

const isAuthAdmin = (req: Request): boolean => {
  const { userId, userRole } = req;
  if (!userId || userId == '') {
    return false;
  }
  return userRole === 'ADMIN';
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
  getUserId,
  isAuthAdmin,
  hasRequiredFields,
};
