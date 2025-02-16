import { PrismaClient } from '@prisma/client';
import { NewBcryptParser } from '../src/libs/passwords';
import config from '../src/config';
import app from '../src/app';

const prisma = new PrismaClient();

export const userClient = prisma.user;
const cfg = config();
export const getServer = async () => app(cfg);

export const hasher = NewBcryptParser(cfg.hashSalt);

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});
