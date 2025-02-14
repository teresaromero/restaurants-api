import dotenv from 'dotenv';

// only load .env file if not in test environment
if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
}

interface Config {
  Port(): string;
}

export default function initConfig(): Config {
  const rawConfig = {
    PORT: process.env.PORT || '3000',
  };

  return {
    Port: () => rawConfig.PORT,
  };
}
