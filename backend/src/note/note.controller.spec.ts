import { Test, TestingModule } from '@nestjs/testing';
import { CanActivate } from '@nestjs/common';

// Mock entities before importing anything that uses them
jest.mock('src/infra/database/entities/Note', () => ({}));
jest.mock('src/infra/database/entities/User', () => ({}));
jest.mock('./note.providers', () => ({
  NOTE_MODULE: {
    noteService: Symbol('NOTE_REPOSITORY'),
  },
  noteProviders: [],
}));

// Mock AuthGuard before importing the controller
jest.mock('src/auth/auth.guard', () => ({
  AuthGuard: class MockAuthGuard implements CanActivate {
    canActivate() {
      return true;
    }
  },
}));

import { NoteController } from './note.controller';
import { NoteService } from './note.service';

describe('NoteController', () => {
  let controller: NoteController;
  let mockNoteService: jest.Mocked<NoteService>;

  beforeEach(async () => {
    // Create mock for NoteService with all required methods
    mockNoteService = {
      createNote: jest.fn(),
      findByUser: jest.fn(),
    } as unknown as jest.Mocked<NoteService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoteController],
      providers: [
        {
          provide: NoteService,
          useValue: mockNoteService,
        },
      ],
    }).compile();

    controller = module.get<NoteController>(NoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a note via service', () => {
    const mockUser = { uuid: '123', username: 'testuser' };
    const mockNoteData = { title: 'Test Note', content: 'Test content' };

    controller.createNotes({ user: mockUser } as any, mockNoteData as any);

    expect(mockNoteService.createNote).toHaveBeenCalledWith(mockNoteData, mockUser);
  });

  it('should find notes by user', async () => {
    const mockUser = { uuid: '123', username: 'testuser' };
    const mockNotes = [
      {
        uuid: 'note1',
        title: 'Note 1',
        content: 'Content 1',
        user: mockUser,
      },
    ];

    mockNoteService.findByUser.mockResolvedValue(mockNotes as any);

    const result = await controller.getNotes({ user: mockUser } as any);

    expect(mockNoteService.findByUser).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockNotes);
  });
});
