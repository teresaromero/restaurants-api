import { NewAuthServices } from './auth.services';

describe('Auth Services', () => {
  const mockUserRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockPasswordsUtil = {
    compare: jest.fn(),
    hash: jest.fn(),
  };

  const mockJwtUtil = {
    generateToken: jest.fn(),
  };

  const authServices = NewAuthServices(
    mockUserRepository,
    mockPasswordsUtil,
    mockJwtUtil,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUserByEmailAndPassword', () => {
    const mockLoginData = {
      email: 'test@test.com',
      password: 'password123',
    };

    const mockUser = {
      email: 'test@test.com',
      password: 'hashedPassword',
      role: 'user',
    };

    it('should login user successfully with valid credentials', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockPasswordsUtil.compare.mockResolvedValue(true);
      mockJwtUtil.generateToken.mockReturnValue('mockToken');

      const result =
        await authServices.loginUserByEmailAndPassword(mockLoginData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        mockLoginData.email,
      );
      expect(mockPasswordsUtil.compare).toHaveBeenCalledWith(
        mockLoginData.password,
        mockUser.password,
      );
      expect(mockJwtUtil.generateToken).toHaveBeenCalledWith({
        userId: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toBe('mockToken');
    });

    it('should throw error if user is not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        authServices.loginUserByEmailAndPassword(mockLoginData),
      ).rejects.toThrow('Invalid username or password');
    });

    it('should throw error if password is invalid', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockPasswordsUtil.compare.mockResolvedValue(false);

      await expect(
        authServices.loginUserByEmailAndPassword(mockLoginData),
      ).rejects.toThrow('Invalid username or password');
    });
  });
  describe('registerUser', () => {
    const validUserData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'secret',
    };

    const createdUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedSecret',
      role: 'USER',
      created_at: new Date(),
    };

    it('should register user successfully when data is valid and email does not exist', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordsUtil.hash.mockResolvedValue('hashedSecret');
      mockUserRepository.create.mockResolvedValue(null);

      await authServices.registerUser(validUserData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        validUserData.email,
      );
      expect(mockPasswordsUtil.hash).toHaveBeenCalledWith(
        validUserData.password,
      );
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        name: validUserData.name,
        email: validUserData.email,
        password: 'hashedSecret',
        role: 'USER',
      });
    });

    it('should throw error if user already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(createdUser);

      await expect(authServices.registerUser(validUserData)).rejects.toThrow(
        'Invalid username or password',
      );
    });
  });
});
