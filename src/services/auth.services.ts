import { users } from '@prisma/client';
import { LoginEmailPasswordInput, TokenClaims } from '../types';

interface UserRepository {
  findByEmail: (email: string) => Promise<users | null>;
  create: (data: Omit<users, 'id' | 'created_at'>) => Promise<users>;
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
    registerUser: registerUser(userRepository, passwordsUtil),
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

const registerUser =
  (userRepository: UserRepository, passwordsUtil: PasswordsUtil) =>
  async (data: any): Promise<void> => {
    const { name, email, password } = data;
    if (!name || !email || !password) {
      throw new Error('Missing required fields');
    }
    const userRole = 'USER';

    const user = await userRepository.findByEmail(email);
    if (user) {
      throw new Error('User already exists');
    }

    const hashedPassword = await passwordsUtil.hash(password);

    await userRepository.create({
      name,
      role: userRole,
      email,
      password: hashedPassword,
    });
  };
