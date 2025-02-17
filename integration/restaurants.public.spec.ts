import request from 'supertest';
import { Application } from 'express';
import { clearDatabase, createRestaurants, getServer } from './global.setup';
import { Restaurant } from '@prisma/client';

describe('Public Restaurant API', () => {
  let appServer: Application;
  let dbRestaurants: Restaurant[];
  beforeAll(async () => {
    appServer = await getServer();
    dbRestaurants = await createRestaurants();
  });
  afterAll(async () => {
    await clearDatabase();
  });
  describe('Get Restaurants List', () => {
    it('GET /restaurants should return list of restaurants', async () => {
      const response = await request(appServer).get('/restaurants').expect(200);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(dbRestaurants.length);
    });
    it.skip('GET /restaurants should return list of restaurants with pagination', async () => {});
  });
  describe('Get Restaurant Detail', () => {
    it('GET /restaurants/:restaurantId should return restaurant detail', async () => {
      const response = await request(appServer)
        .get(`/restaurants/${dbRestaurants[0].id}`)
        .expect(200);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(dbRestaurants[0].id);
      expect(response.body.data.name).toBe(dbRestaurants[0].name);
      expect(response.body.data.operating_hours).toBeDefined();
    });
    it('GET /restaurants/:restaurantId should return 404 if restaurant not found', async () => {
      const response = await request(appServer)
        .get('/restaurants/999')
        .expect(404);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Restaurant not found');
    });
  });
});
