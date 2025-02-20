import status from 'http-status';
import { APIError, UnauthorizedError } from '../types/errors';
import { LoggedUser } from '../types/models';
import { Request, Response } from 'express';

interface UserService {
  getUserById: (id: number) => Promise<LoggedUser>;
}

export const NewUserController = (service: UserService) => {
  return {
    getUser: getUserById(service),
  };
};

const getUserById =
  (service: UserService) => async (req: Request, res: Response) => {
    try {
      const { userId } = req;
      if (!userId) {
        throw new UnauthorizedError();
      }

      const data = await service.getUserById(userId);
      res.json({ data });
    } catch (error) {
      if (error instanceof APIError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res
        .status(status.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error' });
    }
  };
