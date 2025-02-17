import express, { RequestHandler } from 'express';

interface Middlewares {
  authenticated: RequestHandler;
}

export const NewMeRouter = (middlewares: Middlewares): express.Router => {
  const privateRouter = express.Router();
  privateRouter.use(middlewares.authenticated);

  privateRouter.get('/', (_req, res) => {
    res.send('Get logged users');
  });
  privateRouter.get('/reviews', (_req, res) => {
    res.send('Get user reviews');
  });
  privateRouter.put('/reviews/:id', (_req, res) => {
    res.send('Update user review');
  });
  privateRouter.delete('/reviews/:id', (_req, res) => {
    res.send('Delete user review');
  });
  privateRouter.get('/favorites', (_req, res) => {
    res.send('Get user favorites');
  });
  privateRouter.post('/favorites/:restaurantId', (_req, res) => {
    res.send('Mark as favorite');
  });
  privateRouter.delete('/favorites/:restaurantId', (_req, res) => {
    res.send('Delete from favorites');
  });

  return privateRouter;
};
