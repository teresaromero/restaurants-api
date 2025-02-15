import request from 'supertest';
import { prisma, getServer, hasher } from './global.setup';

describe('Authentication End-to-End Tests', () => {
  let appServer: any;
  beforeAll(async () => {
    appServer = await getServer();
    await prisma.users.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Register Flow', () => {
    it('should register a new user successfully', async () => {
      const registerResponse = await request(appServer)
        .post('/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User',
        })
        .expect(201);

      expect(registerResponse.body).toBeNull();

      const createdUser = await prisma.users.findUnique({
        where: { email: 'newuser@example.com' },
      });
      expect(createdUser).not.toBeNull();
    });

    it('should return Internal Server Error if user already exists', async () => {
      await prisma.users.create({
        data: {
          email: 'duplicate@example.com',
          password: 'password123',
          name: 'New User',
          role: 'USER',
        },
      });

      const registerResponse = await request(appServer)
        .post('/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'password123',
          name: 'New User',
        })
        .expect(500);

      expect(registerResponse.body).toBeNull();

      const duplicatedUser = await prisma.users.findUnique({
        where: { email: 'duplicate@example.com' },
      });
      expect(duplicatedUser).not.toBeNull();
    });

    it('should return Bad Request if missing fields on body request', async () => {
      const registerResponse = await request(appServer)
        .post('/auth/register')
        .send({
          email: 'newuser2@example.com',
        })
        .expect(400);

      expect(registerResponse.body).toBeNull();

      const createdUser = await prisma.users.findUnique({
        where: { email: 'newuser2@example.com' },
      });
      expect(createdUser).toBeNull();
    });
  });

  describe('Login Flow', () => {
    beforeAll(async () => {
      const hashPassword = await hasher.hash('password123');

      await prisma.users.create({
        data: {
          email: 'loginuser@example.com',
          password: hashPassword,
          name: 'Login User',
          role: 'USER',
        },
      });
    });

    it('should login successfully with valid credentials', async () => {
      const loginResponse = await request(appServer)
        .post('/auth/login')
        .send({
          email: 'loginuser@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('token');
    });
  });
});
