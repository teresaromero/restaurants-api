import express, { RequestHandler } from 'express';

export interface Middlewares {
  authenticated: RequestHandler;
}

export const NewMeRouter = (middlewares: Middlewares): express.Router => {
  const meRouter = express.Router();
  meRouter.use(middlewares.authenticated);

  meRouter.get('/', (_req, res) => {
    res.send('Get logged users');
  });
  meRouter.get('/reviews', (_req, res) => {
    res.send('Get user reviews');
  });
  meRouter.put('/reviews/:id', (_req, res) => {
    res.send('Update user review');
  });
  meRouter.delete('/reviews/:id', (_req, res) => {
    res.send('Delete user review');
  });
  meRouter.get('/favorites', (_req, res) => {
    res.send('Get user favorites');
  });
  meRouter.post('/favorites/:restaurantId', (_req, res) => {
    res.send('Mark as favorite');
  });
  meRouter.delete('/favorites/:restaurantId', (_req, res) => {
    res.send('Delete from favorites');
  });

  return meRouter;
};
