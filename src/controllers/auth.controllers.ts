import { Request, Response } from 'express';
import { LoginEmailPasswordInput } from '../types';
import { APIError, InvalidPayload } from '../types/errors';
import status from 'http-status';

type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
};

export interface AuthServices {
  loginUserByEmailAndPassword: (
    data: LoginEmailPasswordInput,
  ) => Promise<string>;
  registerUser: (data: RegisterUserInput) => Promise<void>;
}

export const NewAuthController = (authServices: AuthServices) => {
  return {
    login: login(authServices),
    register: register(authServices),
  };
};

const login =
  (authServices: AuthServices) => async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new InvalidPayload();
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    try {
      const token = await authServices.loginUserByEmailAndPassword({
        email,
        password,
      });
      res.status(200).json({ token });
    } catch (error) {
      if (error instanceof APIError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      res
        .status(status.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal server error' });
    }
  };

const register =
  (authServices: AuthServices) => async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      const error = new InvalidPayload();
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    try {
      await authServices.registerUser({
        name,
        email,
        password,
      });
      res.status(status.CREATED).json({ message: 'User created' });
    } catch (error) {
      if (error instanceof APIError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      console.log('register controller error: ', error);
      res
        .status(status.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal server error' });
    }
  };
