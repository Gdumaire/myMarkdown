import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/infra/database/typeorm.module';
import { NoteController } from './note.controller';
import { noteProviders } from './note.providers';
import { NoteService } from './note.service';

@Module({
  imports: [ TypeOrmModule, DatabaseModule ],
  providers: [...noteProviders, NoteService],
  exports: [...noteProviders, NoteService],
  controllers: [NoteController],
})
export class NoteModule {}
