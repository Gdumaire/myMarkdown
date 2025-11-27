import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import type { NoteDTO } from './dto/note.dto';
import { NoteService } from './note.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Note } from 'src/infra/database/entities/Note';

@Controller('note')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @UseGuards(AuthGuard)
  @Get()
  getNotes(@Req() request: Request): Promise<Note[]> {
    return this.noteService.findByUser(request['user']);
  }

  @UseGuards(AuthGuard)
  @Post()
  createNotes(@Req() request:Request, @Body() note: NoteDTO): void {
    this.noteService.createNote(note, request['user']);
  }
}
