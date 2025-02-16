import bcrypt from 'bcrypt';

export const NewBcryptParser = (saltRounds: number) => {
  return {
    hash: hashPassword(saltRounds),
    compare: comparePasswords,
  };
};

const hashPassword = (saltRounds: number) => (plainPassword: string) => {
  return bcrypt.hash(plainPassword, saltRounds);
};

const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string,
) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
