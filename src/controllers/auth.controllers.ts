import { Request, Response } from 'express';
import { LoginEmailPasswordInput } from '../types';

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
      return res.status(400).json(null);
    }
    try {
      const token = await authServices.loginUserByEmailAndPassword({
        email,
        password,
      });
      res.status(200).json({ token });
    } catch {
      // TODO: Handle error
      res.status(500).json(null);
    }
  };

const register =
  (authServices: AuthServices) => async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json(null);
    }
    try {
      await authServices.registerUser({
        name,
        email,
        password,
      });
      res.status(201).json(null);
    } catch {
      res.status(500).json(null);
    }
  };
