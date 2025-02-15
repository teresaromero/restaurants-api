import { NewBcryptParser } from './passwords';

describe('Password utils', () => {
  const saltRounds = 10;
  const parser = NewBcryptParser(saltRounds);
  const plainPassword = 'test123';

  describe('hash', () => {
    it('should hash password', async () => {
      const hashedPassword = await parser.hash(plainPassword);
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toEqual(plainPassword);
      expect(typeof hashedPassword).toBe('string');
    });

    it('should generate different hashes for same password', async () => {
      const hash1 = await parser.hash(plainPassword);
      const hash2 = await parser.hash(plainPassword);
      expect(hash1).not.toEqual(hash2);
    });
  });

  describe('compare', () => {
    it('should return true for matching passwords', async () => {
      const hashedPassword = await parser.hash(plainPassword);
      const result = await parser.compare(plainPassword, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const hashedPassword = await parser.hash(plainPassword);
      const result = await parser.compare('wrongpassword', hashedPassword);
      expect(result).toBe(false);
    });
  });
});
