import jwt from 'jsonwebtoken';
import { TokenClaims } from '../types';

export const NewJWTUtil = (
  jwtSecretKey: string,
  accessTokenExpiresIn: number,
) => {
  return {
    generateToken: generateToken(jwtSecretKey, accessTokenExpiresIn),
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
