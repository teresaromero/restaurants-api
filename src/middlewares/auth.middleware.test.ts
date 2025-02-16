import { Request, Response, NextFunction } from 'express';
import { NewAuthMiddleware } from './auth.middleware';
import { TokenClaims } from '../types';

describe('Auth Middleware', () => {
  let jwtUtil: {
    verifyToken: jest.Mock<Promise<TokenClaims | null>, [string]>;
  };
  let req: Request;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    jwtUtil = {
      verifyToken: jest.fn(),
    };

    req = {
      headers: {},
    } as Request;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  describe('authenticated middleware', () => {
    it('should return 401 if no authorization header is provided', async () => {
      const { authenticated } = NewAuthMiddleware(jwtUtil);
      await authenticated(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(null);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is missing after "Bearer"', async () => {
      req.headers.authorization = 'Bearer';
      const { authenticated } = NewAuthMiddleware(jwtUtil);
      await authenticated(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(null);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token verification returns null', async () => {
      req.headers.authorization = 'Bearer invalidtoken';
      jwtUtil.verifyToken.mockResolvedValue(null);
      const { authenticated } = NewAuthMiddleware(jwtUtil);
      await authenticated(req as Request, res as Response, next);
      expect(jwtUtil.verifyToken).toHaveBeenCalledWith('invalidtoken');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(null);
      expect(next).not.toHaveBeenCalled();
    });

    it('should attach user information and call next if token is valid', async () => {
      req.headers.authorization = 'Bearer validtoken';
      const claims: TokenClaims = { userId: '123', role: 'USER' };
      jwtUtil.verifyToken.mockResolvedValue(claims);
      const { authenticated } = NewAuthMiddleware(jwtUtil);
      await authenticated(req as Request, res as Response, next);
      expect(jwtUtil.verifyToken).toHaveBeenCalledWith('validtoken');
      expect(req).toHaveProperty('userId', '123');
      expect(req).toHaveProperty('userRole', 'USER');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('onlyAdminAuthorized middleware', () => {
    it('should return 401 if req.userRole is not set', () => {
      const { onlyAdminAuthorized } = NewAuthMiddleware(jwtUtil);
      onlyAdminAuthorized()(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(null);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if req.userRole is not ADMIN', () => {
      req.userRole = 'USER';
      const { onlyAdminAuthorized } = NewAuthMiddleware(jwtUtil);
      onlyAdminAuthorized()(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(null);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if req.userRole is ADMIN', () => {
      req.userRole = 'ADMIN';
      const { onlyAdminAuthorized } = NewAuthMiddleware(jwtUtil);
      onlyAdminAuthorized()(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
