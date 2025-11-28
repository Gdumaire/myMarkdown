import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

jest.mock('src/infra/database/entities/User', () => ({}));
jest.mock('./users.providers', () => ({
  USER_MODULE: {
    userService: Symbol('USER_REPOSITORY'),
  },
  userProviders: [],
}));

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    mockUsersService = {
      createUser: jest.fn(),
      getUserById: jest.fn(),
      getUserByEmailAndPassword: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUpUser', () => {
    it('should call createUser with username and password', async () => {
      const userDTO = {
        username: 'newuser',
        password: 'password123',
      };

      const createdUser = {
        uuid: 'user-new-123',
        username: 'newuser',
        password: 'password123',
      };

      mockUsersService.createUser.mockResolvedValue(createdUser);

      await controller.signUpUser(userDTO as any);

      expect(mockUsersService.createUser).toHaveBeenCalledWith('newuser', 'password123');
    });

    it('should not call createUser if username is missing', async () => {
      const userDTO = {
        password: 'password123',
      };

      await controller.signUpUser(userDTO as any);

      expect(mockUsersService.createUser).not.toHaveBeenCalled();
    });

    it('should not call createUser if password is missing', async () => {
      const userDTO = {
        username: 'newuser',
      };

      await controller.signUpUser(userDTO as any);

      expect(mockUsersService.createUser).not.toHaveBeenCalled();
    });

    it('should not call createUser if both username and password are missing', async () => {
      const userDTO = {};

      await controller.signUpUser(userDTO as any);

      expect(mockUsersService.createUser).not.toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('should return user by username and password', async () => {
      const userDTO = {
        username: 'testuser',
        password: 'password123',
      };

      const mockUser = {
        uuid: 'user-123',
        username: 'testuser',
        password: 'password123',
      };

      mockUsersService.getUserByEmailAndPassword.mockResolvedValue(mockUser);

      const result = await controller.getUser(userDTO as any);

      expect(mockUsersService.getUserByEmailAndPassword).toHaveBeenCalledWith('testuser', 'password123');
      expect(result).toEqual(mockUser);
    });

    it('should return user by uuid when username/password not provided', async () => {
      const userDTO = {
        uuid: 'user-456',
      };

      const mockUser = {
        uuid: 'user-456',
        username: 'someuser',
        password: 'somepassword',
      };

      mockUsersService.getUserById.mockResolvedValue(mockUser);

      const result = await controller.getUser(userDTO as any);

      expect(mockUsersService.getUserById).toHaveBeenCalledWith('user-456');
      expect(mockUsersService.getUserByEmailAndPassword).not.toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should prioritize username/password over uuid', async () => {
      const userDTO = {
        username: 'testuser',
        password: 'password123',
        uuid: 'user-456',
      };

      const mockUser = {
        uuid: 'user-123',
        username: 'testuser',
        password: 'password123',
      };

      mockUsersService.getUserByEmailAndPassword.mockResolvedValue(mockUser);

      const result = await controller.getUser(userDTO as any);

      expect(mockUsersService.getUserByEmailAndPassword).toHaveBeenCalledWith('testuser', 'password123');
      expect(mockUsersService.getUserById).not.toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should return null if no valid parameters provided', async () => {
      const userDTO = {};

      const result = await controller.getUser(userDTO as any);

      expect(mockUsersService.getUserByEmailAndPassword).not.toHaveBeenCalled();
      expect(mockUsersService.getUserById).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should return null when user not found by username/password', async () => {
      const userDTO = {
        username: 'nonexistent',
        password: 'wrongpass',
      };

      mockUsersService.getUserByEmailAndPassword.mockResolvedValue(null);

      const result = await controller.getUser(userDTO as any);

      expect(result).toBeNull();
    });

    it('should return null when user not found by uuid', async () => {
      const userDTO = {
        uuid: 'non-existent-uuid',
      };

      mockUsersService.getUserById.mockResolvedValue(null);

      const result = await controller.getUser(userDTO as any);

      expect(result).toBeNull();
    });
  });
});
