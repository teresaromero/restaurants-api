import { Request, Response, NextFunction } from 'express';
import { NewAuthMiddleware } from './auth.middleware';
import { TokenClaims } from '../types';
import status from 'http-status';

describe('Auth Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let statusSpy: jest.Mock;
  let jsonSpy: jest.Mock;

  const validToken = 'valid.token.here';
  const invalidToken = 'invalid.token.here';

  const dummyClaims: TokenClaims = {
    userId: '123',
    role: 'USER',
  };

  const jwtUtil = {
    verifyToken: jest.fn((token: string): TokenClaims | null => {
      if (token === validToken) {
        return dummyClaims;
      }
      return null;
    }),
  };

  const { authenticated, onlyAdminAuthorized } = NewAuthMiddleware(jwtUtil);

  beforeEach(() => {
    req = {};
    jsonSpy = jest.fn();
    statusSpy = jest.fn().mockReturnValue({ json: jsonSpy });
    res = {
      status: statusSpy,
      json: jsonSpy,
    };
    next = jest.fn();
  });

  describe('authenticated', () => {
    it('should return 401 if no Authorization header is provided', () => {
      req.headers = {};
      authenticated(req as Request, res as Response, next);

      expect(statusSpy).toHaveBeenCalledWith(status.UNAUTHORIZED);
      expect(jsonSpy).toHaveBeenCalledWith({ error: 'Unauthorized' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is missing in the Authorization header', () => {
      req.headers = { authorization: 'Bearer' };
      authenticated(req as Request, res as Response, next);

      expect(statusSpy).toHaveBeenCalledWith(status.UNAUTHORIZED);
      expect(jsonSpy).toHaveBeenCalledWith({ error: 'Unauthorized' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token verification fails', () => {
      req.headers = { authorization: `Bearer ${invalidToken}` };
      authenticated(req as Request, res as Response, next);

      expect(statusSpy).toHaveBeenCalledWith(status.UNAUTHORIZED);
      expect(jsonSpy).toHaveBeenCalledWith({ error: 'Unauthorized' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should attach user properties to the request and call next if token is valid', () => {
      req.headers = { authorization: `Bearer ${validToken}` };
      authenticated(req as Request, res as Response, next);

      expect(jwtUtil.verifyToken).toHaveBeenCalledWith(validToken);
      expect(req.userId).toEqual(dummyClaims.userId);
      expect(req.userRole).toEqual(dummyClaims.role);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('onlyAdminAuthorized', () => {
    const middleware = onlyAdminAuthorized;

    it('should return FORBIDDEN if userRole is missing', () => {
      req.userRole = undefined;
      middleware(req as Request, res as Response, next);

      expect(statusSpy).toHaveBeenCalledWith(status.FORBIDDEN);
      expect(jsonSpy).toHaveBeenCalledWith({ error: 'Forbidden' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return FORBIDDEN if userRole is not ADMIN', () => {
      req.userRole = 'USER';
      middleware(req as Request, res as Response, next);

      expect(statusSpy).toHaveBeenCalledWith(status.FORBIDDEN);
      expect(jsonSpy).toHaveBeenCalledWith({ error: 'Forbidden' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if userRole is ADMIN', () => {
      req.userRole = 'ADMIN';
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
