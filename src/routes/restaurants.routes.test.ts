import express from 'express';
import request from 'supertest';
import { NewRestaurantsRouter } from './restaurants.routes';
import status from 'http-status';

describe('NewRestaurantsRouter', () => {
  let app: express.Express;
  const mockAuthMiddleware = {
    authenticated: jest.fn(),
    onlyAdminAuthorized: jest.fn(),
  };

  const mockRequestHandler = jest.fn().mockImplementation((_req, res) => {
    res.status(status.OK).json({ message: 'OK' });
  });

  const restaurantsController = {
    getRestaurantsList: mockRequestHandler,
    getRestaurant: mockRequestHandler,
    createRestaurant: mockRequestHandler,
    updateRestaurant: mockRequestHandler,
  };

  const reviewsController = {
    getListForRestaurant: mockRequestHandler,
    createForRestaurant: mockRequestHandler,
  };

  beforeAll(() => {
    app = express();
    const { publicRouter, privateRouter, adminRouter } = NewRestaurantsRouter(
      mockAuthMiddleware,
      {
        restaurants: restaurantsController,
        reviews: reviewsController,
      },
    );
    app.use('/public', publicRouter);
    app.use('/private', privateRouter);
    app.use('/privateAdmin', adminRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('privateRouter', () => {
    it('POST "/:id/reviews" should allow authenticated calls, regardles the role', async () => {
      mockAuthMiddleware.authenticated.mockImplementation((_req, _res, next) =>
        next(),
      );

      const res = await request(app).post('/private/1/reviews');
      expect(res.statusCode).toEqual(200);
      expect(mockAuthMiddleware.authenticated).toHaveBeenCalledTimes(1);
      expect(mockAuthMiddleware.onlyAdminAuthorized).toHaveBeenCalledTimes(0);
      expect(mockRequestHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('privateAdminRouter', () => {
    it('POST "/" should allow authenticated and admin calls', async () => {
      mockAuthMiddleware.authenticated.mockImplementation(
        (_req, _res, next) => {
          next();
        },
      );

      mockAuthMiddleware.onlyAdminAuthorized.mockImplementation(
        (_req, _res, next) => {
          next();
        },
      );

      const res = await request(app).post('/privateAdmin/');
      expect(res.statusCode).toEqual(200);
      expect(mockAuthMiddleware.authenticated).toHaveBeenCalledTimes(1);
      expect(mockAuthMiddleware.onlyAdminAuthorized).toHaveBeenCalledTimes(1);
      expect(mockRequestHandler).toHaveBeenCalledTimes(1);
    });

    it('PUT "/:id" should allow authenticated and admin calls', async () => {
      mockAuthMiddleware.authenticated.mockImplementation((_req, _res, next) =>
        next(),
      );
      mockAuthMiddleware.onlyAdminAuthorized.mockImplementation(
        (_req, _res, next) => next(),
      );

      const res = await request(app).put('/privateAdmin/1');
      expect(res.statusCode).toEqual(200);
      expect(mockAuthMiddleware.authenticated).toHaveBeenCalledTimes(1);
      expect(mockAuthMiddleware.onlyAdminAuthorized).toHaveBeenCalledTimes(1);
      expect(mockRequestHandler).toHaveBeenCalledTimes(1);
    });

    it('POST "/" should reject authenticated and non-admin calls', async () => {
      mockAuthMiddleware.authenticated.mockImplementation((_req, _res, next) =>
        next(),
      );
      mockAuthMiddleware.onlyAdminAuthorized.mockImplementation((_req, res) =>
        res.status(status.UNAUTHORIZED).json({ error: 'Unauthorized' }),
      );
      const res = await request(app).post('/privateAdmin/');
      expect(res.statusCode).toEqual(status.UNAUTHORIZED);
      expect(mockAuthMiddleware.authenticated).toHaveBeenCalledTimes(1);
      expect(mockAuthMiddleware.onlyAdminAuthorized).toHaveBeenCalledTimes(1);
      expect(mockRequestHandler).not.toHaveBeenCalled();
    });

    it('PUT "/:id" should reject authenticated and non-admin calls', async () => {
      mockAuthMiddleware.authenticated.mockImplementation((_req, _res, next) =>
        next(),
      );
      mockAuthMiddleware.onlyAdminAuthorized.mockImplementation((_req, res) =>
        res.status(status.FORBIDDEN).json({ error: 'Forbidden' }),
      );
      const res = await request(app).put('/privateAdmin/1');
      expect(res.statusCode).toEqual(status.FORBIDDEN);
      expect(mockAuthMiddleware.authenticated).toHaveBeenCalledTimes(1);
      expect(mockAuthMiddleware.onlyAdminAuthorized).toHaveBeenCalledTimes(1);
      expect(mockRequestHandler).not.toHaveBeenCalled();
    });

    it('POST "/" should reject non-authenticated calls', async () => {
      mockAuthMiddleware.authenticated.mockImplementation((_req, res) =>
        res.status(status.UNAUTHORIZED).json({ error: 'Unauthorized' }),
      );
      const res = await request(app).post('/privateAdmin/');
      expect(res.statusCode).toEqual(status.UNAUTHORIZED);
      expect(mockAuthMiddleware.authenticated).toHaveBeenCalledTimes(1);
      expect(mockAuthMiddleware.onlyAdminAuthorized).not.toHaveBeenCalled();
      expect(mockRequestHandler).not.toHaveBeenCalled();
    });

    it('PUT "/:id" should reject non-authenticated calls', async () => {
      mockAuthMiddleware.authenticated.mockImplementation((_req, res) =>
        res.status(status.UNAUTHORIZED).json({ error: 'Unauthorized' }),
      );
      const res = await request(app).put('/privateAdmin/1');
      expect(res.statusCode).toEqual(status.UNAUTHORIZED);
      expect(mockAuthMiddleware.authenticated).toHaveBeenCalledTimes(1);
      expect(mockAuthMiddleware.onlyAdminAuthorized).not.toHaveBeenCalled();
      expect(mockRequestHandler).not.toHaveBeenCalled();
    });
  });

  describe('publicRouter', () => {
    it('GET "/" should allow all calls', async () => {
      const res = await request(app).get('/public/');
      expect(res.statusCode).toEqual(200);
      expect(mockRequestHandler).toHaveBeenCalledTimes(1);
    });

    it('GET "/:id" should allow all calls', async () => {
      const res = await request(app).get('/public/1');
      expect(res.statusCode).toEqual(200);
      expect(mockRequestHandler).toHaveBeenCalledTimes(1);
    });

    it('GET "/:id/reviews" should allow all calls', async () => {
      const res = await request(app).get('/public/1/reviews');
      expect(res.statusCode).toEqual(200);
      expect(mockRequestHandler).toHaveBeenCalledTimes(1);
    });
  });
});
