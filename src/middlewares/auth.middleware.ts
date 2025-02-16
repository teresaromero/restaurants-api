import { TokenClaims } from '../types';
import { NextFunction, Request, Response } from 'express';

interface JwtUtil {
  verifyToken: (token: string) => Promise<TokenClaims | null>;
}

export const NewAuthMiddleware = (jwtUtil: JwtUtil) => {
  return {
    authenticated: authenticated(jwtUtil),
    onlyAdminAuthorized: onlyAdminAuthorized,
  };
};

const authenticated =
  (jwtUtil: JwtUtil) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json(null);
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json(null);
    }
    const claims = await jwtUtil.verifyToken(token);
    if (!claims) {
      return res.status(401).json(null);
    }

    req.userId = claims.userId;
    req.userRole = claims.role;

    next();
  };

const onlyAdminAuthorized = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole || req.userRole !== 'ADMIN') {
      return res.status(401).json(null);
    }
    next();
  };
};
