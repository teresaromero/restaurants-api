import { Request, Response } from 'express';

type LoginEmailPasswordInput = {
  email: string;
  password: string;
};

type TokenResponse = {
  token: string;
};

interface AuthServices {
  loginUserByEmailAndPassword: (
    data: LoginEmailPasswordInput,
  ) => Promise<TokenResponse>;
}

export const NewAuthController = (authServices: AuthServices) => {
  return {
    login: login(authServices),
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
      res.status(200).json(token);
    } catch (error) {
      // TODO: Handle error
      res.status(500).json(null);
    }
  };
