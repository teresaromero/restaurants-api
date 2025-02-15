import dotenv from 'dotenv';

// only load .env file if not in test environment
if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
}

export default () => ({
  PORT: process.env.PORT || '3000',
});
