
import { DataSource } from 'typeorm';
import { Note } from '../infra/database/entities/Note';

export const NOTE_MODULE = {
  noteService: Symbol('NOTE_REPOSITORY')
}

export const noteProviders = [
  {
    provide: NOTE_MODULE.noteService,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Note),
    inject: ['DATA_SOURCE'],
  },
];
