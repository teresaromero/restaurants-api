import { PrismaClient } from '@prisma/client';
import app from '../src/app';
import config from '../src/config';
import { NewBcryptParser } from '../src/libs/passwords';

export const prisma = new PrismaClient();
const cfg = config();
export const getServer = async () => app(cfg);

export const hasher = NewBcryptParser(cfg.hashSalt);

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});
