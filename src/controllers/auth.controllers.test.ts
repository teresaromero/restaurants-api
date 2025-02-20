import { Request, Response } from 'express';
import { AuthServices, NewAuthController } from './auth.controllers';
import status from 'http-status';

describe('Auth Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockAuthServices: jest.Mocked<AuthServices>;

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
      registerUser: jest.fn(),
    };
  });

  describe('login', () => {
    it('should return BadRequest if email is missing', async () => {
      mockRequest.body = { password: 'test123' };

      const controller = NewAuthController(mockAuthServices);
      await controller.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(status.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid payload',
      });
    });

    it('should return BadRequest if password is missing', async () => {
      mockRequest.body = { email: 'test@test.com' };

      const controller = NewAuthController(mockAuthServices);
      await controller.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(status.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid payload',
      });
    });

    it('should return 200 and token on successful login', async () => {
      mockRequest.body = { email: 'test@test.com', password: 'test123' };
      mockAuthServices.loginUserByEmailAndPassword.mockResolvedValue(
        'fake-token',
      );

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

      expect(mockResponse.status).toHaveBeenCalledWith(
        status.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
    });
  });
  describe('register', () => {
    beforeEach(() => {
      mockAuthServices.registerUser = jest.fn();
    });

    it('should return 400 if email is missing', async () => {
      mockRequest.body = { password: 'test123', name: 'Test User' };

      const controller = NewAuthController(mockAuthServices);
      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(status.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid payload',
      });
    });

    it('should return 400 if password is missing', async () => {
      mockRequest.body = { email: 'test@test.com', name: 'Test User' };

      const controller = NewAuthController(mockAuthServices);
      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(status.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid payload',
      });
    });

    it('should return 400 if name is missing', async () => {
      mockRequest.body = { email: 'test@test.com', password: 'test123' };

      const controller = NewAuthController(mockAuthServices);
      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(status.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid payload',
      });
    });

    it('should return 201 on successful registration', async () => {
      mockRequest.body = {
        email: 'test@test.com',
        password: 'test123',
        name: 'Test User',
      };
      mockAuthServices.registerUser.mockResolvedValue(undefined);

      const controller = NewAuthController(mockAuthServices);
      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(status.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User created',
      });
    });

    it('should return 500 if service throws error', async () => {
      mockRequest.body = {
        email: 'test@test.com',
        password: 'test123',
        name: 'Test User',
      };
      mockAuthServices.registerUser.mockRejectedValue(new Error());

      const controller = NewAuthController(mockAuthServices);
      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(
        status.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
    });
  });
});
