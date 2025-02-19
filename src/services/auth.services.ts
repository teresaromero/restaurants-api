import { User, type Prisma as type } from '@prisma/client';
import { LoginEmailPasswordInput, TokenClaims } from '../types';
import { InvalidUserOrPassword } from '../types/errors';

interface UserRepository {
  findByEmail: (email: string) => Promise<User | null>;
  create: (data: type.UserCreateInput) => Promise<User>;
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
      throw new InvalidUserOrPassword();
    }

    const isPasswordValid = await passwordsUtil.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new InvalidUserOrPassword();
    }

    return jwtUtil.generateToken({ userId: user.email, role: user.role });
  };

const registerUser =
  (userRepository: UserRepository, passwordsUtil: PasswordsUtil) =>
  async (data: type.UserCreateInput): Promise<void> => {
    const { name, email, password } = data;
    if (!name || !email || !password) {
      throw new InvalidUserOrPassword();
    }
    const userRole = 'USER';

    const user = await userRepository.findByEmail(email);
    if (user) {
      throw new InvalidUserOrPassword();
    }

    const hashedPassword = await passwordsUtil.hash(password);

    await userRepository.create({
      name,
      role: userRole,
      email,
      password: hashedPassword,
    });
  };
