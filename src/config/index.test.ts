import config from '.';

describe('Config', () => {
  describe('Required environment variables', () => {
    beforeEach(() => {
      delete process.env.PORT;
      delete process.env.JWT_SECRET;
      delete process.env.JWT_EXPIRES_IN;
      delete process.env.HASH_SALT;
    });
    afterEach(() => {
      delete process.env.PORT;
      delete process.env.JWT_SECRET;
      delete process.env.JWT_EXPIRES_IN;
      delete process.env.HASH_SALT;
    });
    it('should throw error when JWT_SECRET is not defined', () => {
      expect(process.env.JWT_SECRET).toBeUndefined();
      expect(() => config()).toThrow(
        'Environment JWT_SECRET, JWT_ESPIRES_IN, HASH_SALT not provided',
      );
    });
    it('should throw error when JWT_EXPIRES_IN is not defined', () => {
      expect(process.env.JWT_EXPIRES_IN).toBeUndefined();
      expect(() => config()).toThrow(
        'Environment JWT_SECRET, JWT_ESPIRES_IN, HASH_SALT not provided',
      );
    });
    it('should throw error when HASH_SALT is not defined', () => {
      expect(process.env.HASH_SALT).toBeUndefined();
      expect(() => config()).toThrow(
        'Environment JWT_SECRET, JWT_ESPIRES_IN, HASH_SALT not provided',
      );
    });
    it('should throw error when JWT_EXPIRES_IN is not an integer', () => {
      process.env.JWT_SECRET = 'secret';
      process.env.JWT_EXPIRES_IN = 'not-an-integer';
      process.env.HASH_SALT = '10';
      expect(() => config()).toThrow('JWT_EXPIRES_IN must be an integer');
    });
    it('should throw error when HASH_SALT is not an integer', () => {
      process.env.JWT_SECRET = 'secret';
      process.env.JWT_EXPIRES_IN = '3600';
      process.env.HASH_SALT = 'not-an-integer';
      expect(() => config()).toThrowError('HASH_SALT must be an integer');
    });
    it('should return configuration when all required environment variables are defined', () => {
      process.env.JWT_SECRET = 'secret';
      process.env.JWT_EXPIRES_IN = '3600';
      process.env.HASH_SALT = '10';
      const cfg = config();
      expect(cfg.PORT).toBe('3000');
      expect(cfg.jwtSecret).toBe('secret');
      expect(cfg.jwtExpiresIn).toBe(3600);
      expect(cfg.hashSalt).toBe(10);
    });
  });

  describe('Optional environment variables', () => {
    beforeEach(() => {
      delete process.env.PORT;
      process.env.JWT_SECRET = 'secret';
      process.env.JWT_EXPIRES_IN = '3600';
      process.env.HASH_SALT = '10';
    });
    afterEach(() => {
      delete process.env.JWT_SECRET;
      delete process.env.JWT_EXPIRES_IN;
      delete process.env.HASH_SALT;
    });
    it('PORT should return default value when not defined', () => {
      expect(process.env.PORT).toBeUndefined();
      const cfg = config();
      expect(cfg.PORT).toBe('3000');
    });
    it('PORT should return environment value when set', () => {
      expect(process.env.PORT).toBeUndefined();
      process.env.PORT = '4000';
      expect(process.env.PORT).toBe('4000');

      const cfg = config();
      expect(cfg.PORT).toBe('4000');

      delete process.env.PORT;
    });
  });
});
