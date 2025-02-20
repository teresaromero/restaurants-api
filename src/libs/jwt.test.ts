import jwt from 'jsonwebtoken';
import { NewJWTUtil } from './jwt';

describe('JWT Utils', () => {
  const mockSecretKey = 'test-secret-key';
  const mockExpiresIn = 3600;
  const mockClaims = {
    userId: 123,
    role: 'admin',
  };

  describe('generate', () => {
    it('should generate a valid JWT token with provided claims', () => {
      const jwtUtil = NewJWTUtil(mockSecretKey, mockExpiresIn);
      const token = jwtUtil.generateToken(mockClaims);

      expect(token).toBeDefined();

      const decoded = jwt.verify(token, mockSecretKey) as jwt.JwtPayload;
      expect(decoded.userId).toBe(mockClaims.userId);
      expect(decoded.role).toBe(mockClaims.role);
    });

    it('should generate token with correct expiration time', () => {
      const jwtUtil = NewJWTUtil(mockSecretKey, mockExpiresIn);
      const token = jwtUtil.generateToken(mockClaims);

      const decoded = jwt.verify(token, mockSecretKey) as jwt.JwtPayload;
      const nowInSeconds = Math.floor(Date.now() / 1000);

      expect(decoded.exp).toBeGreaterThan(nowInSeconds);
    });
  });
});
