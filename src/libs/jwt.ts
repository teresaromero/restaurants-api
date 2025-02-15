import jwt from 'jsonwebtoken';

export const NewJWTUtil = (
  jwtSecretKey: string,
  accessTokenExpiresIn: number,
) => {
  return {
    generate: generateToken(jwtSecretKey, accessTokenExpiresIn),
  };
};

type TokenClaims = {
  userId: string;
  role: string;
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
