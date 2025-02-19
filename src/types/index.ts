export type LoginEmailPasswordInput = {
  email: string;
  password: string;
};

export type TokenClaims = {
  userId: number;
  role: string;
};
