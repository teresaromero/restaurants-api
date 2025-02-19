import { TokenClaims } from '../types';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { status } from 'http-status';

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
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const claims = jwtUtil.verifyToken(token);
    if (!claims) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    req.userId = claims.userId;
    req.userRole = claims.role;

    next();
  };

const onlyAdminAuthorized = (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole || req.userRole !== 'ADMIN') {
      res.status(status.FORBIDDEN).json({ error: 'Forbidden' });
      return;
    }
    next();
  };
};
