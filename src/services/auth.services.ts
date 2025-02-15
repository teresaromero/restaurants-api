import { users } from '@prisma/client';
import { LoginEmailPasswordInput, TokenClaims } from '../types';

interface UserRepository {
  findByEmail: (email: string) => Promise<users | null>;
}

interface PasswordsUtil {
  compare: (password: string, hash: string) => Promise<boolean>;
  hash: (password: string) => Promise<string>;
}

interface JwtUtil {
  generateToken: (claims: TokenClaims) => string;
}

export const NewAuthServices = (
  userRepository: UserRepository,
  passwordsUtil: PasswordsUtil,
  jwtUtil: JwtUtil,
) => {
  return {
    loginUserByEmailAndPassword: loginUserByEmailAndPassword(
      userRepository,
      passwordsUtil,
      jwtUtil,
    ),
    registerUser: registerUser(),
  };
};

const loginUserByEmailAndPassword =
  (
    userRepository: UserRepository,
    passwordsUtil: PasswordsUtil,
    jwtUtil: JwtUtil,
  ) =>
  async (data: LoginEmailPasswordInput): Promise<string> => {
    const { email, password } = data;

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await passwordsUtil.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return jwtUtil.generateToken({ userId: user.email, role: user.role });
  };

const registerUser = () => async () => {};
