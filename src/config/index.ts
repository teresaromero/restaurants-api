import dotenv from 'dotenv';

dotenv.config();

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
