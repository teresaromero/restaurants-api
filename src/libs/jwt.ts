import jwt from 'jsonwebtoken';
import { TokenClaims } from '../types';

export const NewJWTUtil = (
  jwtSecretKey: string,
  accessTokenExpiresIn: number,
) => {
  return {
    generateToken: generateToken(jwtSecretKey, accessTokenExpiresIn),
    verifyToken: verifyToken(jwtSecretKey),
  };
};

const generateToken =
  (jwtSecretKey: string, accessTokenExpiresIn: number) =>
  (claims: TokenClaims) => {
    return jwt.sign({ ...claims }, jwtSecretKey, {
      expiresIn: accessTokenExpiresIn,
      algorithm: 'HS256',
      subject: claims.userId,
    });
  };

const verifyToken =
  (jwtSecretKey: string) =>
  (token: string): TokenClaims | null => {
    const very = jwt.verify(token, jwtSecretKey) as jwt.JwtPayload;
    if (!very) {
      return null;
    }
    if (!very.sub || !very.role) {
      return null;
    }
    return {
      userId: very.sub,
      role: very.role,
    } as TokenClaims;
  };
