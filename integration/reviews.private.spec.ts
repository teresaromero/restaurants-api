import request from 'supertest';
import { Application } from 'express';
import { getServer } from './global.setup';
import { faker } from '@faker-js/faker';
import { adminJWTFn, userJWTFn } from './mocks';

describe('Private Reviews API', () => {
  let appServer: Application;
  const userJWT = userJWTFn();
  const adminJWT = adminJWTFn();

  beforeAll(async () => {
    appServer = await getServer();
  });

  describe('Post Restaurant Review', () => {
    it('POST /restaurants/:restaurantId/reviews should fail if not Authenticated', async () => {
      const response = await request(appServer)
        .post(`/restaurants/1/reviews`)
        .send({
          rating: 5,
          comments: faker.lorem.sentence(),
        })
        .expect(401);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Unauthorized');
    });

    it('POST /restaurants/:restaurantId/reviews should fail if restaurant not exist', async () => {
      const response = await request(appServer)
        .post(`/restaurants/4/reviews`)
        .send({
          rating: 5,
          comments: faker.lorem.sentence(),
        })
        .auth(userJWT, { type: 'bearer' })
        .expect(400);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Restaurant not found');
    });

    it('POST /restaurants/:restaurantId/reviews should allow Authenticated USER and return Review', async () => {
      const response = await request(appServer)
        .post(`/restaurants/1/reviews`)
        .send({
          rating: 5,
          comments: faker.lorem.sentence(),
        })
        .auth(userJWT, { type: 'bearer' })
        .expect(200);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('rating', 5);
      expect(response.body.data).toHaveProperty('comments', expect.any(String));
      expect(response.body.data).toHaveProperty('date', expect.any(String));
      expect(response.body.data).toHaveProperty('author', expect.any(String));
      expect(response.body.data).toHaveProperty('restaurantId', 1);
    });

    it('POST /restaurants/:restaurantId/reviews should allow Authenticated ADMIN and return Review', async () => {
      const response = await request(appServer)
        .post(`/restaurants/1/reviews`)
        .send({
          rating: 4,
          comments: faker.lorem.sentence(),
        })
        .auth(adminJWT, { type: 'bearer' })
        .expect(200);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('rating', 4);
      expect(response.body.data).toHaveProperty('comments', expect.any(String));
      expect(response.body.data).toHaveProperty('date', expect.any(String));
      expect(response.body.data).toHaveProperty('author', expect.any(String));
      expect(response.body.data).toHaveProperty('restaurantId', 1);
    });
  });
});
