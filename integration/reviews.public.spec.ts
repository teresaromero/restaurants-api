import request from 'supertest';
import { Application } from 'express';
import { getServer } from './global.setup';

describe('Public Reviews API', () => {
  let appServer: Application;
  beforeAll(async () => {
    appServer = await getServer();
  });

  describe('Get Restaurant Reviews', () => {
    it('GET /restaurants/:restaurantId/reviews should return list of reviews', async () => {
      const response = await request(appServer)
        .get(`/restaurants/1/reviews`)
        .expect(200);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(3);
    });
    it('GET /restaurants/:restaurantId/reviews should return empty list when restaurant not found', async () => {
      const response = await request(appServer)
        .get('/restaurants/4/reviews')
        .expect(200);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toStrictEqual([]);
    });
  });
});
