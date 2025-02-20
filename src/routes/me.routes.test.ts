import express from 'express';
import { NewMeRouter } from './me.routes';
import request from 'supertest';

describe('NewMeRouter', () => {
  let app: express.Express;
  const mockAuthenticated = jest.fn();

  const authMiddleware = {
    authenticated: mockAuthenticated,
    onlyAdminAuthorized: jest.fn(),
  };
  const controllers = {
    restaurants: {
      getFavoritesForUser: jest.fn(),
    },
    reviews: {
      getReviewsByUserId: jest.fn(),
      updateUserReview: jest.fn(),
      deleteUserReview: jest.fn(),
    },
    favorites: {
      createForUser: jest.fn(),
      deleteForUser: jest.fn(),
    },
    user: {
      getUser: jest.fn(),
    },
  };

  beforeAll(() => {
    app = express();
    const router = NewMeRouter(authMiddleware, controllers);
    app.use(router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET "/" should allow authenticated calls', async () => {
    mockAuthenticated.mockImplementation((_req, _res, next) => next());
    controllers.user.getUser.mockImplementation((_req, res) =>
      res.sendStatus(200),
    );
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(mockAuthenticated).toHaveBeenCalledTimes(1);
  });

  it('GET "/" should reject not authenticated calls', async () => {
    mockAuthenticated.mockImplementation((_req, res) => res.sendStatus(401));

    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(401);
    expect(mockAuthenticated).toHaveBeenCalledTimes(1);
  });
});
