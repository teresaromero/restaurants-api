import { Request, Response } from 'express';
import { NewAuthController } from './auth.controllers';

describe('Auth Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockAuthServices: any;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockAuthServices = {
      loginUserByEmailAndPassword: jest.fn(),
    };
  });

  describe('login', () => {
    it('should return 400 if email is missing', async () => {
      mockRequest.body = { password: 'test123' };

      const controller = NewAuthController(mockAuthServices);
      await controller.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(null);
    });

    it('should return 400 if password is missing', async () => {
      mockRequest.body = { email: 'test@test.com' };

      const controller = NewAuthController(mockAuthServices);
      await controller.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(null);
    });

    it('should return 200 and token on successful login', async () => {
      mockRequest.body = { email: 'test@test.com', password: 'test123' };
      mockAuthServices.loginUserByEmailAndPassword.mockResolvedValue({
        token: 'fake-token',
      });

      const controller = NewAuthController(mockAuthServices);
      await controller.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ token: 'fake-token' });
    });

    it('should return 500 if service throws error', async () => {
      mockRequest.body = { email: 'test@test.com', password: 'test123' };
      mockAuthServices.loginUserByEmailAndPassword.mockRejectedValue(
        new Error(),
      );

      const controller = NewAuthController(mockAuthServices);
      await controller.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(null);
    });
  });
});
