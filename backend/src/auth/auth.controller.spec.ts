import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

jest.mock('src/infra/database/entities/User', () => ({}));
jest.mock('src/users/users.providers', () => ({
  USER_MODULE: {
    userService: Symbol('USER_REPOSITORY'),
  },
  userProviders: [],
}));

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    mockAuthService = {
      signIn: jest.fn(),
      signUp: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should call authService.signIn with username and password', async () => {
      const signInDto = {
        username: 'testuser',
        password: 'password123',
      };

      const mockResponse = {
        access_token: 'jwt-token-xyz',
      };

      mockAuthService.signIn.mockResolvedValue(mockResponse);

      const result = await controller.signIn(signInDto);

      expect(mockAuthService.signIn).toHaveBeenCalledWith('testuser', 'password123');
      expect(result).toEqual(mockResponse);
    });

    it('should return access token on successful login', async () => {
      const signInDto = {
        username: 'john_doe',
        password: 'securepass',
      };

      const mockResponse = {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      };

      mockAuthService.signIn.mockResolvedValue(mockResponse);

      const result = await controller.signIn(signInDto);

      expect(result.access_token).toBeDefined();
      expect(result).toEqual(mockResponse);
    });

    it('should propagate errors from authService', async () => {
      const signInDto = {
        username: 'wronguser',
        password: 'wrongpass',
      };

      mockAuthService.signIn.mockRejectedValue(new Error('Dafuq bro'));

      await expect(controller.signIn(signInDto)).rejects.toThrow('Dafuq bro');

      expect(mockAuthService.signIn).toHaveBeenCalledWith('wronguser', 'wrongpass');
    });

    it('should handle special characters in credentials', async () => {
      const signInDto = {
        username: 'user@example.com',
        password: 'P@ssw0rd!#$%',
      };

      const mockResponse = {
        access_token: 'jwt-token-special',
      };

      mockAuthService.signIn.mockResolvedValue(mockResponse);

      const result = await controller.signIn(signInDto);

      expect(mockAuthService.signIn).toHaveBeenCalledWith('user@example.com', 'P@ssw0rd!#$%');
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty credentials gracefully', async () => {
      const signInDto = {
        username: '',
        password: '',
      };

      mockAuthService.signIn.mockRejectedValue(new Error('Dafuq bro'));

      await expect(controller.signIn(signInDto)).rejects.toThrow('Dafuq bro');

      expect(mockAuthService.signIn).toHaveBeenCalledWith('', '');
    });
  });
});
