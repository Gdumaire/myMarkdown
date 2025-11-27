import { Inject, Injectable } from '@nestjs/common';
import { NOTE_MODULE } from './note.providers';
import { Note } from 'src/infra/database/entities/Note';
import { Repository } from 'typeorm';
import { User } from 'src/infra/database/entities/User';

@Injectable()
export class NoteService {
  constructor(@Inject(NOTE_MODULE.noteService) private noteRepository: Repository<Note>) {}

  createNote(note: Partial<Note>, user: User): void {
    const newNote = this.noteRepository.create({...note,...user});

    this.noteRepository.save(newNote);
  }

  findByUser(user: User): Promise<Note[]> {
    return this.noteRepository.find({where: {
      user
    }})
  }
}
