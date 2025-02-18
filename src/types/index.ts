export type LoginEmailPasswordInput = {
  email: string;
  password: string;
};

export type TokenClaims = {
  userId: string;
  role: string;
};
