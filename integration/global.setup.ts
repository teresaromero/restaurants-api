import { PrismaClient } from '@prisma/client';
import { NewBcryptParser } from '../src/libs/passwords';
import config from '../src/config';
import app from '../src/app';
import { NewJWTUtil } from '../src/libs/jwt';
import {
  seedRestaurantsFn,
  seedRestaurantsReviewsFn,
  seedUserFn,
} from './mocks';

const prisma = new PrismaClient();

export const userClient = prisma.user;
export const restaurantClient = prisma.restaurant;
export const reviewClient = prisma.review;
export const operatingHourClient = prisma.operatingHour;

const cfg = config();
export const getServer = async () => app(cfg);

export const hasher = NewBcryptParser(cfg.hashSalt);
export const jwtTool = NewJWTUtil(cfg.jwtSecret, cfg.jwtExpiresIn);

beforeAll(async () => {
  await prisma.$connect();
  await seedRestaurantsFn();
  await seedUserFn();
  await seedRestaurantsReviewsFn();
});

afterAll(async () => {
  await reviewClient.deleteMany();
  await operatingHourClient.deleteMany();

  await restaurantClient.deleteMany();
  await userClient.deleteMany();
  await prisma.$disconnect();
});
