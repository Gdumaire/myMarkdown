import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

// Mock the NOTE_MODULE symbol and providers before importing NoteService
jest.mock('./note.providers', () => ({
  NOTE_MODULE: {
    noteService: Symbol('NOTE_REPOSITORY'),
  },
  noteProviders: [],
}));

// Mock the entities
jest.mock('src/infra/database/entities/Note', () => ({}));
jest.mock('src/infra/database/entities/User', () => ({}));

// Now we can safely import NoteService
import { NoteService } from './note.service';
import { NOTE_MODULE } from './note.providers';

describe('NoteService', () => {
  let service: NoteService;
  let mockNoteRepository: jest.Mocked<Repository<any>>;

  beforeEach(async () => {
    // Create a mock Repository with all required TypeORM methods
    mockNoteRepository = {
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
        NoteService,
        {
          provide: NOTE_MODULE.noteService,
          useValue: mockNoteRepository,
        },
      ],
    }).compile();

    service = module.get<NoteService>(NoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNote', () => {
    it('should create and save a note', () => {
      const mockUser = {
        uuid: 'user-123',
        username: 'testuser',
        password: 'password',
      };

      const noteData = {
        title: 'Test Note',
        content: 'Test content',
      };

      const mockCreatedNote = {
        uuid: 'note-123',
        title: 'Test Note',
        content: 'Test content',
        user: mockUser,
      };

      mockNoteRepository.create.mockReturnValue(mockCreatedNote);
      mockNoteRepository.save.mockResolvedValue(mockCreatedNote);

      service.createNote(noteData, mockUser as any);

      expect(mockNoteRepository.create).toHaveBeenCalledWith({
        ...noteData,
        ...mockUser,
      });
      expect(mockNoteRepository.save).toHaveBeenCalledWith(mockCreatedNote);
    });
  });

  describe('findByUser', () => {
    it('should find all notes for a user', async () => {
      const mockUser = {
        uuid: 'user-123',
        username: 'testuser',
        password: 'password',
      };

      const mockNotes = [
        {
          uuid: 'note-1',
          title: 'Note 1',
          content: 'Content 1',
          user: mockUser,
        },
        {
          uuid: 'note-2',
          title: 'Note 2',
          content: 'Content 2',
          user: mockUser,
        },
      ];

      mockNoteRepository.find.mockResolvedValue(mockNotes);

      const result = await service.findByUser(mockUser as any);

      expect(mockNoteRepository.find).toHaveBeenCalledWith({
        where: {
          user: mockUser,
        },
      });
      expect(result).toEqual(mockNotes);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when user has no notes', async () => {
      const mockUser = {
        uuid: 'user-123',
        username: 'testuser',
        password: 'password',
      };

      mockNoteRepository.find.mockResolvedValue([]);

      const result = await service.findByUser(mockUser as any);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});
