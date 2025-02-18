import request from 'supertest';
import { Application } from 'express';
import {
  getServer,
  restaurantClient,
  reviewClient,
  userClient,
} from './global.setup';
import { faker } from '@faker-js/faker';

describe('Public Reviews API', () => {
  let appServer: Application;
  beforeAll(async () => {
    appServer = await getServer();
    await reviewClient.deleteMany();

    const seedRestaurant = await restaurantClient.create({
      data: {
        id: 1,
        name: 'Restaurant A',
      },
    });
    const seedUser = await userClient.create({
      data: {
        id: 1,
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
      },
    });
    await reviewClient.createMany({
      data: Array.from({ length: 3 }).map((_, i) => ({
        id: i + 1,
        rating: faker.number.int({ min: 1, max: 5 }),
        comments: faker.lorem.sentence(),
        restaurant_id: seedRestaurant.id,
        user_id: seedUser.id,
      })),
    });
  });
  afterAll(async () => {
    await reviewClient.deleteMany();
    await restaurantClient.deleteMany();
    await userClient.deleteMany();
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
