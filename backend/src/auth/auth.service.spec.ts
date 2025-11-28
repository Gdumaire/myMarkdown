import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

jest.mock('src/infra/database/entities/User', () => ({}));
jest.mock('src/users/users.providers', () => ({
  USER_MODULE: {
    userService: Symbol('USER_REPOSITORY'),
  },
  userProviders: [],
}));

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: jest.Mocked<UsersService>;
  let mockJwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    mockUsersService = {
      createUser: jest.fn(),
      getUserById: jest.fn(),
      getUserByEmailAndPassword: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    mockJwtService = {
      signAsync: jest.fn(),
      sign: jest.fn(),
      verify: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return an access token when credentials are valid', async () => {
      const mockUser = {
        uuid: 'user-123',
        username: 'testuser',
        password: 'password123',
      };

      const mockToken = 'jwt-token-xyz';

      mockUsersService.getUserByEmailAndPassword.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      const result = await service.signIn('testuser', 'password123');

      expect(mockUsersService.getUserByEmailAndPassword).toHaveBeenCalledWith('testuser', 'password123');
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({ uuid: 'user-123' });
      expect(result).toEqual({ access_token: mockToken });
    });

    it('should throw an error when user is not found', async () => {
      mockUsersService.getUserByEmailAndPassword.mockResolvedValue(null);

      await expect(service.signIn('nonexistent', 'wrongpass')).rejects.toThrow(
        'Dafuq bro'
      );

      expect(mockUsersService.getUserByEmailAndPassword).toHaveBeenCalledWith('nonexistent', 'wrongpass');
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw an error when password is incorrect', async () => {
      mockUsersService.getUserByEmailAndPassword.mockResolvedValue(null);

      await expect(service.signIn('testuser', 'wrongpassword')).rejects.toThrow(
        'Dafuq bro'
      );

      expect(mockUsersService.getUserByEmailAndPassword).toHaveBeenCalledWith('testuser', 'wrongpassword');
    });

    it('should sign JWT with correct user uuid', async () => {
      const mockUser = {
        uuid: 'unique-uuid-456',
        username: 'anotheruser',
        password: 'pass456',
      };

      const mockToken = 'another-jwt-token';

      mockUsersService.getUserByEmailAndPassword.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      await service.signIn('anotheruser', 'pass456');

      expect(mockJwtService.signAsync).toHaveBeenCalledWith({ uuid: 'unique-uuid-456' });
    });
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      const newUser = {
        uuid: 'user-new-789',
        username: 'newuser',
        password: 'newpass',
      };

      mockUsersService.createUser.mockResolvedValue(newUser);

      const result = await service.signUp('newuser', 'newpass');

      expect(mockUsersService.createUser).toHaveBeenCalledWith('newuser', 'newpass');
      expect(result).toEqual(newUser);
    });

    it('should pass username and password to createUser', async () => {
      const newUser = {
        uuid: 'user-new-123',
        username: 'testuser',
        password: 'testpass',
      };

      mockUsersService.createUser.mockResolvedValue(newUser);

      await service.signUp('testuser', 'testpass');

      expect(mockUsersService.createUser).toHaveBeenCalledWith('testuser', 'testpass');
    });

    it('should propagate errors from createUser', async () => {
      mockUsersService.createUser.mockRejectedValue(new Error('Database error'));

      await expect(service.signUp('user', 'pass')).rejects.toThrow('Database error');

      expect(mockUsersService.createUser).toHaveBeenCalledWith('user', 'pass');
    });

    it('should handle special characters in username and password', async () => {
      const newUser = {
        uuid: 'user-special',
        username: 'user@example.com',
        password: 'P@ssw0rd!#$',
      };

      mockUsersService.createUser.mockResolvedValue(newUser);

      const result = await service.signUp('user@example.com', 'P@ssw0rd!#$');

      expect(mockUsersService.createUser).toHaveBeenCalledWith('user@example.com', 'P@ssw0rd!#$');
      expect(result.username).toEqual('user@example.com');
    });
  });
});
