import request from 'supertest';
import { Application } from 'express';
import { getServer, restaurantClient } from './global.setup';
import { Restaurant as RestaurantData } from '@prisma/client';
describe('Public Restaurant API', () => {
  let appServer: Application;
  let seedRestaurants: RestaurantData[];
  beforeAll(async () => {
    appServer = await getServer();
    // clear all restaurants and seed some data
    await restaurantClient.deleteMany();

    seedRestaurants = await restaurantClient.createManyAndReturn({
      data: [
        { id: 1, name: 'Restaurant A' },
        { id: 2, name: 'Restaurant B' },
        { id: 3, name: 'Restaurant C' },
      ],
    });
  });
  afterAll(async () => {
    // clean up all restaurants
    await restaurantClient.deleteMany();
  });
  describe('Get Restaurants List', () => {
    it('GET /restaurants should return list of restaurants', async () => {
      const response = await request(appServer).get('/restaurants').expect(200);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(seedRestaurants.length);
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
      expect(response.body.data).toHaveProperty('operating_hours');
      expect(response.body.data.operating_hours).toHaveLength(0);
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
