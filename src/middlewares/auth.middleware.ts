import { TokenClaims } from '../types';
import { NextFunction, Request, RequestHandler, Response } from 'express';

interface JwtUtil {
  verifyToken: (token: string) => TokenClaims | null;
}

export const NewAuthMiddleware = (jwtUtil: JwtUtil) => {
  return {
    authenticated: authenticated(jwtUtil),
    onlyAdminAuthorized: onlyAdminAuthorized(),
  };
};

const authenticated =
  (jwtUtil: JwtUtil): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json(null);
      return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json(null);
      return;
    }
    const claims = jwtUtil.verifyToken(token);
    if (!claims) {
      res.status(401).json(null);
      return;
    }

    req.userId = claims.userId;
    req.userRole = claims.role;

    next();
  };

const onlyAdminAuthorized = (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole || req.userRole !== 'ADMIN') {
      res.status(401).json(null);
      return;
    }
    next();
  };
};
