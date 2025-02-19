import dotenv from 'dotenv';

// only load .env file if not in test environment
if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
}

const loadEnvs = () => {
  if (
    !process.env.JWT_SECRET ||
    !process.env.JWT_EXPIRES_IN ||
    !process.env.HASH_SALT
  ) {
    throw new Error(
      'Environment JWT_SECRET, JWT_ESPIRES_IN, HASH_SALT not provided',
    );
  }

  const expiration = parseInt(process.env.JWT_EXPIRES_IN, 10);
  if (isNaN(expiration)) {
    throw new Error('JWT_EXPIRES_IN must be an integer');
  }
  const salt = parseInt(process.env.HASH_SALT, 10);
  if (isNaN(salt)) {
    throw new Error('HASH_SALT must be an integer');
  }
  return {
    PORT: process.env.PORT || '3000',
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: expiration,
    hashSalt: salt,
  };
};

export default () => loadEnvs();
