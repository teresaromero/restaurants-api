import express, { Request, Response } from 'express';

interface AuthController {
  login: (req: Request, res: Response) => void;
  register: (req: Request, res: Response) => void;
}

export const NewAuthRouter = (
  authController: AuthController,
): express.Router => {
  const authRouter = express.Router();
  authRouter.post('/login', authController.login);
  authRouter.post('/register', authController.register);

  return authRouter;
};
