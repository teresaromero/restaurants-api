import jwt from 'jsonwebtoken';
import { TokenClaims } from '../types';
import { UnauthorizedError } from '../types/errors';

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
      subject: `${claims.userId}`,
    });
  };

const verifyToken =
  (jwtSecretKey: string) =>
  (token: string): TokenClaims => {
    const verifiedToken = jwt.verify(token, jwtSecretKey, {});
    if (typeof verifiedToken == 'string') {
      throw new UnauthorizedError();
    }
    const role = verifiedToken['role'];
    if (!role) {
      throw new UnauthorizedError();
    }
    const subject = verifiedToken.sub;
    if (!subject) {
      throw new UnauthorizedError();
    }
    const userId = parseInt(subject);
    if (isNaN(userId)) {
      throw new UnauthorizedError();
    }
    return {
      userId,
      role,
    };
  };
