import express from 'express';
import request from 'supertest';
import { NewRestaurantsRouter } from './restaurants.routes';

describe('NewRestaurantsRouter', () => {
  let app: express.Express;
  const mockAuthenticated = jest.fn();
  const mockOnlyAdminAuthorized = jest.fn();
  const authMiddleware = {
    authenticated: mockAuthenticated,
    onlyAdminAuthorized: mockOnlyAdminAuthorized,
  };

  const mockRequestHandler = jest.fn().mockImplementation((_req, res) => {
    res.status(200).json(null);
  });

  const restaurantsController = {
    getRestaurantsList: mockRequestHandler,
    getRestaurantById: mockRequestHandler,
    getReviewsForRestaurantId: mockRequestHandler,
    createRestaurant: mockRequestHandler,
    updateRestaurantById: mockRequestHandler,
    createReviewForRestaurantId: mockRequestHandler,
  };

  beforeAll(() => {
    app = express();
    const router = NewRestaurantsRouter(authMiddleware, restaurantsController);
    app.use(router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('privateAdminRouter', () => {
    it('POST "/" should allow authenticated and admin calls', async () => {
      mockAuthenticated.mockImplementation((_req, _res, next) => next());
      mockOnlyAdminAuthorized.mockImplementation((_req, _res, next) => next());

      const res = await request(app).post('/');
      expect(res.statusCode).toEqual(200);
      expect(mockAuthenticated).toHaveBeenCalledTimes(1);
      expect(mockOnlyAdminAuthorized).toHaveBeenCalledTimes(1);
      expect(mockRequestHandler).toHaveBeenCalledTimes(1);
    });

    it('PUT "/:id" should allow authenticated and admin calls', async () => {
      mockAuthenticated.mockImplementation((_req, _res, next) => next());
      mockOnlyAdminAuthorized.mockImplementation((_req, _res, next) => next());

      const res = await request(app).put('/1');
      expect(res.statusCode).toEqual(200);
      expect(mockAuthenticated).toHaveBeenCalledTimes(1);
      expect(mockOnlyAdminAuthorized).toHaveBeenCalledTimes(1);
      expect(mockRequestHandler).toHaveBeenCalledTimes(1);
    });

    it('POST "/:id/reviews" should allow authenticated and admin calls', async () => {
      mockAuthenticated.mockImplementation((_req, _res, next) => next());
      mockOnlyAdminAuthorized.mockImplementation((_req, _res, next) => next());

      const res = await request(app).post('/1/reviews');
      expect(res.statusCode).toEqual(200);
      expect(mockAuthenticated).toHaveBeenCalledTimes(1);
      expect(mockOnlyAdminAuthorized).toHaveBeenCalledTimes(1);
      expect(mockRequestHandler).toHaveBeenCalledTimes(1);
    });

    it('POST "/" should reject authenticated and non-admin calls', async () => {
      mockAuthenticated.mockImplementation((_req, _res, next) => next());
      mockOnlyAdminAuthorized.mockImplementation((_req, res) =>
        res.status(401).json(null),
      );
      const res = await request(app).post('/');
      expect(res.statusCode).toEqual(401);
      expect(mockAuthenticated).toHaveBeenCalledTimes(1);
      expect(mockOnlyAdminAuthorized).toHaveBeenCalledTimes(1);
      expect(mockRequestHandler).not.toHaveBeenCalled();
    });

    it('PUT "/:id" should reject authenticated and non-admin calls', async () => {
      mockAuthenticated.mockImplementation((_req, _res, next) => next());
      mockOnlyAdminAuthorized.mockImplementation((_req, res) =>
        res.status(401).json(null),
      );
      const res = await request(app).put('/1');
      expect(res.statusCode).toEqual(401);
      expect(mockAuthenticated).toHaveBeenCalledTimes(1);
      expect(mockOnlyAdminAuthorized).toHaveBeenCalledTimes(1);
      expect(mockRequestHandler).not.toHaveBeenCalled();
    });

    it('POST "/:id/reviews" should reject authenticated and non-admin calls', async () => {
      mockAuthenticated.mockImplementation((_req, _res, next) => next());
      mockOnlyAdminAuthorized.mockImplementation((_req, res) =>
        res.status(401).json(null),
      );

      const res = await request(app).post('/1/reviews');
      expect(res.statusCode).toEqual(401);
      expect(mockAuthenticated).toHaveBeenCalledTimes(1);
      expect(mockOnlyAdminAuthorized).toHaveBeenCalledTimes(1);
      expect(mockRequestHandler).not.toHaveBeenCalled();
    });

    it('POST "/" should reject non-authenticated calls', async () => {
      mockAuthenticated.mockImplementation((_req, res) =>
        res.status(401).json(null),
      );
      const res = await request(app).post('/');
      expect(res.statusCode).toEqual(401);
      expect(mockAuthenticated).toHaveBeenCalledTimes(1);
      expect(mockOnlyAdminAuthorized).not.toHaveBeenCalled();
      expect(mockRequestHandler).not.toHaveBeenCalled();
    });

    it('PUT "/:id" should reject non-authenticated calls', async () => {
      mockAuthenticated.mockImplementation((_req, res) =>
        res.status(401).json(null),
      );
      const res = await request(app).put('/1');
      expect(res.statusCode).toEqual(401);
      expect(mockAuthenticated).toHaveBeenCalledTimes(1);
      expect(mockOnlyAdminAuthorized).not.toHaveBeenCalled();
      expect(mockRequestHandler).not.toHaveBeenCalled();
    });

    it('POST "/:id/reviews" should reject non-authenticated calls', async () => {
      mockAuthenticated.mockImplementation((_req, res) =>
        res.status(401).json(null),
      );

      const res = await request(app).post('/1/reviews');
      expect(res.statusCode).toEqual(401);
      expect(mockAuthenticated).toHaveBeenCalledTimes(1);
      expect(mockOnlyAdminAuthorized).not.toHaveBeenCalled();
      expect(mockRequestHandler).not.toHaveBeenCalled();
    });
  });

  describe('publicRouter', () => {
    it('GET "/" should allow all calls', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(mockRequestHandler).toHaveBeenCalledTimes(1);
    });

    it('GET "/:id" should allow all calls', async () => {
      const res = await request(app).get('/1');
      expect(res.statusCode).toEqual(200);
      expect(mockRequestHandler).toHaveBeenCalledTimes(1);
    });

    it('GET "/:id/reviews" should allow all calls', async () => {
      const res = await request(app).get('/1/reviews');
      expect(res.statusCode).toEqual(200);
      expect(mockRequestHandler).toHaveBeenCalledTimes(1);
    });
  });
});
