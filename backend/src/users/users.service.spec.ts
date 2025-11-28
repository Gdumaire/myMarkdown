import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { USER_MODULE } from './users.providers';

jest.mock('src/infra/database/entities/User', () => ({}));
jest.mock('./users.providers', () => ({
  USER_MODULE: {
    userService: Symbol('USER_REPOSITORY'),
  }
}));

describe('UsersService', () => {
  let service: UsersService;
  let mockUserRepository: jest.Mocked<Repository<any>>;

  beforeEach(async () => {
    mockUserRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<any>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_MODULE.userService,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return a user if uuid is given', async () => {
      const mockUser = {
        uuid: 'user-123',
        username: 'testUser',
        password: 'testPassword',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const response = await service.getUserById('user-123');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'user-123' },
      });
      expect(response).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const response = await service.getUserById('non-existent-uuid');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'non-existent-uuid' },
      });
      expect(response).toBeNull();
    });
  });

  describe('getUserByEmailAndPassword', () => {
    it('should return a user with matching username and password', async () => {
      const mockUser = {
        uuid: 'user-456',
        username: 'john_doe',
        password: 'securepassword123',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const response = await service.getUserByEmailAndPassword('john_doe', 'securepassword123');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: {
          username: 'john_doe',
          password: 'securepassword123',
        },
      });
      expect(response).toEqual(mockUser);
    });

    it('should return null if credentials do not match', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const response = await service.getUserByEmailAndPassword('john_doe', 'wrongpassword');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: {
          username: 'john_doe',
          password: 'wrongpassword',
        },
      });
      expect(response).toBeNull();
    });

    it('should return null if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const response = await service.getUserByEmailAndPassword('nonexistent', 'password');

      expect(response).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create and save a new user', async () => {
      const newUserData = {
        username: 'newuser',
        password: 'newpassword123',
      };

      const createdUser = {
        uuid: 'user-new-789',
        ...newUserData,
      };

      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(createdUser);

      const response = await service.createUser('newuser', 'newpassword123');

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        username: 'newuser',
        password: 'newpassword123',
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(createdUser);
      expect(response).toEqual(createdUser);
    });

    it('should handle save errors gracefully', async () => {
      const newUserData = {
        username: 'anotheruser',
        password: 'password456',
      };

      const createdUser = {
        uuid: 'user-another',
        ...newUserData,
      };

      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.createUser('anotheruser', 'password456')).rejects.toThrow(
        'Database error'
      );

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        username: 'anotheruser',
        password: 'password456',
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(createdUser);
    });

    it('should create a user with any username and password combination', async () => {
      const testCases = [
        { username: 'admin', password: 'admin_pass' },
        { username: 'user@example.com', password: 'pass123' },
        { username: 'test_user', password: 'complex!@#$%password' },
      ];

      for (const testCase of testCases) {
        mockUserRepository.create.mockReturnValue({
          uuid: `uuid-${testCase.username}`,
          ...testCase,
        });
        mockUserRepository.save.mockResolvedValue({
          uuid: `uuid-${testCase.username}`,
          ...testCase,
        });

        const response = await service.createUser(testCase.username, testCase.password);

        expect(mockUserRepository.create).toHaveBeenCalledWith({
          username: testCase.username,
          password: testCase.password,
        });
        expect(response.username).toEqual(testCase.username);
        expect(response.password).toEqual(testCase.password);
      }
    });
  });
});
