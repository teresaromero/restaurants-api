import request from 'supertest';
import { Application } from 'express';
import { getServer } from './global.setup';
import { faker } from '@faker-js/faker';
import status from 'http-status';
import { adminJWTFn, userJWTFn } from './mocks';

describe('Private Admin Restaurants API', () => {
  let appServer: Application;

  beforeAll(async () => {
    appServer = await getServer();
  });
  afterAll(async () => {});

  describe('Create Restaurant', () => {
    const restaurantData = {
      name: faker.company.name(),
    };
    const adminToken = adminJWTFn();
    const userToken = userJWTFn();

    it('POST /restaurants should fail if not Authenticated', async () => {
      const response = await request(appServer)
        .post(`/restaurants`)
        .send(restaurantData)
        .expect(401);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Unauthorized');
    });

    it('POST /restaurants should not allow Authenticated USER', async () => {
      const response = await request(appServer)
        .post(`/restaurants`)
        .send(restaurantData)
        .auth(userToken, { type: 'bearer' })
        .expect(status.FORBIDDEN);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Forbidden');
    });

    it('POST /restaurants should allow Authenticated ADMIN and return', async () => {
      const response = await request(appServer)
        .post(`/restaurants`)
        .send(restaurantData)
        .auth(adminToken, { type: 'bearer' })
        .expect(status.CREATED);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name', restaurantData.name);
    });

    it('POST /restaurants with operating hours', async () => {
      const restaurantDataWithHours = {
        ...restaurantData,
        operatingHours: [
          { day: 'Monday', hours: '08:00-16:00' },
          { day: 'Tuesday', hours: '08:00' },
          { day: 'Wednesday', hours: '08:00-16:00' },
          { day: 'Thursday', hours: '08:00-16:00' },
          { day: 'Friday', hours: '08:00-16:00' },
          { day: 'Saturday', hours: '08:00-16:00' },
          { day: 'Sunday', hours: '08:00-16:00' },
        ],
      };

      const response = await request(appServer)
        .post(`/restaurants`)
        .send(restaurantDataWithHours)
        .auth(adminToken, { type: 'bearer' })
        .expect(status.CREATED);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name', restaurantData.name);
      expect(response.body.data).toHaveProperty('operatingHours');
      expect(response.body.data.operatingHours).toHaveLength(7);
    });
  });
});
