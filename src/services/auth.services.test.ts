import { NewAuthServices } from './auth.services';

describe('Auth Services', () => {
  const mockUserRepository = {
    findByEmail: jest.fn(),
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

      const result = await authServices.loginUserByEmailAndPassword(
        mockLoginData,
      );

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
      ).rejects.toThrow('User not found');
    });

    it('should throw error if password is invalid', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockPasswordsUtil.compare.mockResolvedValue(false);

      await expect(
        authServices.loginUserByEmailAndPassword(mockLoginData),
      ).rejects.toThrow('Invalid password');
    });
  });
});
