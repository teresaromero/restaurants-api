import express, { RequestHandler } from 'express';

interface Middlewares {
  authenticated: RequestHandler;
  onlyAdminAuthorized: RequestHandler;
}

export const NewRestaurantsRouter = (
  middlewares: Middlewares,
): express.Router => {
  const restaurantsRouter = express.Router();

  const publicRouter = express.Router();
  publicRouter.get('/', (_req, res) => {
    res.send('Get restaurants');
  });
  publicRouter.get('/:id', (_req, res) => {
    res.send('Get restaurant');
  });
  publicRouter.get('/:id/reviews', (_req, res) => {
    res.send('Get restaurant reviews');
  });
  restaurantsRouter.use(publicRouter);

  const privateAdminRouter = express.Router();
  privateAdminRouter.use(
    middlewares.authenticated,
    middlewares.onlyAdminAuthorized,
  );
  privateAdminRouter.post('/', (_req, res) => {
    res.send('Create restaurant');
  });
  privateAdminRouter.put('/:id', (_req, res) => {
    res.send('Update restaurant');
  });
  privateAdminRouter.post('/:id/reviews', (_req, res) => {
    res.send('Create restaurant review');
  });
  restaurantsRouter.use(privateAdminRouter);

  return restaurantsRouter;
};
