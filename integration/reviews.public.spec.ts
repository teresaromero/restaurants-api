import request from 'supertest';
import { Application } from 'express';
import {
  clearDatabase,
  createRestaurantsWithReviews,
  getServer,
} from './global.setup';

describe('Public Restaurant API', () => {
  let appServer: Application;
  let restaurantsDb: { id: number }[];
  beforeAll(async () => {
    appServer = await getServer();
    restaurantsDb = await createRestaurantsWithReviews();
  });
  afterAll(async () => {
    await clearDatabase();
  });

  describe('Get Restaurant Reviews', () => {
    it('GET /restaurants/:restaurantId/reviews should return list of reviews', async () => {
      const response = await request(appServer)
        .get(`/restaurants/${restaurantsDb[0].id}/reviews`)
        .expect(200);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('data');
    });
    it('GET /restaurants/:restaurantId/reviews should return 404 if restaurant not found', async () => {
      await request(appServer).get('/restaurants/9999/reviews').expect(404);
    });
  });
});
