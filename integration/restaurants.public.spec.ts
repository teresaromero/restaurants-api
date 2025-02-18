import request from 'supertest';
import { Application } from 'express';
import { getServer } from './global.setup';

describe('Public Restaurant API', () => {
  let appServer: Application;
  beforeAll(async () => {
    appServer = await getServer();
  });

  describe('Get Restaurants List', () => {
    it('GET /restaurants should return list of restaurants', async () => {
      const response = await request(appServer).get('/restaurants').expect(200);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(3);
    });
    it.skip('GET /restaurants should return list of restaurants with pagination', async () => {});
  });
  describe('Get Restaurant Detail', () => {
    it('GET /restaurants/:restaurantId should return restaurant detail', async () => {
      const response = await request(appServer)
        .get(`/restaurants/1`)
        .expect(200);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(1);
      expect(response.body.data.name).toBe('Restaurant A');
      expect(response.body.data).toHaveProperty('operatingHours');
      expect(response.body.data.operatingHours).toHaveLength(0);
    });
    it('GET /restaurants/:restaurantId should return 404 if restaurant not found', async () => {
      const response = await request(appServer)
        .get('/restaurants/4')
        .expect(404);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Restaurant 4 not found');
    });
  });
});
