import request from 'supertest';
import express, { Express, Response } from 'express';
import { NewAuthRouter } from './auth.routes';

describe('Auth Routes', () => {
  let app: Express;
  let mockLoginController: jest.Mock;
  let mockRegisterController: jest.Mock;

  beforeAll(() => {
    mockLoginController = jest
      .fn()
      .mockImplementation((_req, res: Response) => {
        res.status(200).json(null);
      });
    mockRegisterController = jest
      .fn()
      .mockImplementation((_req, res: Response) => {
        res.status(201).json(null);
      });

    const fakeAuthController = {
      login: mockLoginController,
      register: mockRegisterController,
    } as any;

    const authRoutes = NewAuthRouter(fakeAuthController);
    app = express();
    app.use(authRoutes);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('POST /login should call login controller', async () => {
    const res = await request(app).post('/login');
    expect(res.statusCode).toEqual(200);
    expect(mockLoginController).toHaveBeenCalledTimes(1);
  });

  it('POST /register should call register controller', async () => {
    const res = await request(app).post('/register');
    expect(res.statusCode).toEqual(201);
    expect(mockRegisterController).toHaveBeenCalledTimes(1);
  });
});
