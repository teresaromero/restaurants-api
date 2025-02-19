import { TokenClaims } from '../types';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { APIError, ForbiddenError, UnauthorizedError } from '../types/errors';
import status from 'http-status';

interface JwtUtil {
  verifyToken: (token: string) => TokenClaims;
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
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedError();
      }
      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedError();
      }
      const claims = jwtUtil.verifyToken(token);

      req.userId = claims.userId;
      req.userRole = claims.role;

      next();
    } catch (error) {
      if (error instanceof APIError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      console.log('middleware.authenticated error: ', error);
      res
        .status(status.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal server error' });
    }
  };

const onlyAdminAuthorized = (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole || req.userRole !== 'ADMIN') {
      const error = new ForbiddenError();
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    next();
  };
};
