import dotenv from 'dotenv';

// only load .env file if not in test environment
if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
}

export default () => ({
  PORT: process.env.PORT || '3000',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtExpiresIn: parseInt(process.env.JWT_EXPIRES_IN || '3600', 10),
  hashSalt: parseInt(process.env.HASH_SALT || '10', 10),
});
