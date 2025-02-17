import { PrismaClient, Restaurant } from '@prisma/client';
import { NewBcryptParser } from '../src/libs/passwords';
import config from '../src/config';
import app from '../src/app';

const prisma = new PrismaClient();

export const userClient = prisma.user;
export const restaurantClient = prisma.restaurant;
export const reviewClient = prisma.review;
const cfg = config();
export const getServer = async () => app(cfg);

export const hasher = NewBcryptParser(cfg.hashSalt);

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

export const clearDatabase = async () => {
  await prisma.review.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();
};

export const createRestaurants = async (): Promise<Restaurant[]> => {
  return restaurantClient.createManyAndReturn({
    data: [
      {
        name: 'Restaurant 1',
      },
      {
        name: 'Restaurant 2',
      },
    ],
  });
};

export const createRestaurantsWithReviews = async (): Promise<
  { id: number }[]
> => {
  const author = await userClient.create({
    data: {
      email: 'user@email.com',
      password: await hasher.hash('password123'),
      name: 'User 1',
      role: 'USER',
    },
    select: { id: true },
  });
  const list = await restaurantClient.createManyAndReturn({
    data: [
      {
        name: 'Restaurant 1',
      },
      {
        name: 'Restaurant 2',
      },
    ],
    select: { id: true },
  });
  await reviewClient.createMany({
    data: [
      {
        user_id: author.id,
        restaurant_id: list[0].id,
        rating: 5,
      },
      {
        user_id: author.id,
        restaurant_id: list[1].id,
        rating: 4,
      },
    ],
  });
  return list;
};
