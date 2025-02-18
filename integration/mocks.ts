import { faker } from '@faker-js/faker/.';
import {
  jwtTool,
  restaurantClient,
  reviewClient,
  userClient,
} from './global.setup';

export const seedRestaurantsFn = () =>
  restaurantClient.createMany({
    data: [
      { id: 1, name: 'Restaurant A' },
      { id: 2, name: 'Restaurant B' },
      { id: 3, name: 'Restaurant C' },
    ],
  });

export const seedUserFn = () =>
  userClient.createMany({
    data: [
      {
        id: 1,
        ...randomUserData(),
      },
      {
        id: 2,
        role: 'ADMIN',
        ...randomUserData(),
      },
    ],
  });

export const seedRestaurantsReviewsFn = () =>
  reviewClient.createMany({
    data: Array.from({ length: 3 }).map((_, i) => ({
      id: i + 1,
      rating: faker.number.int({ min: 1, max: 5 }),
      comments: faker.lorem.sentence(),
      restaurant_id: 1,
      user_id: 1,
    })),
  });

export const randomUserData = () => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  name: faker.person.fullName(),
});

export const userJWTFn = () =>
  jwtTool.generateToken({
    role: 'USER',
    userId: '1',
  });

export const adminJWTFn = () =>
  jwtTool.generateToken({
    role: 'ADMIN',
    userId: '2',
  });
