import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatusController } from './status/status.controller';
import { NoteController } from './note/note.controller';
import { NoteService } from './note/note.service';
import { LoggerModule } from './infra/logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './infra/database/typeorm.module';
import { NoteModule } from './note/note.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Support env files located either in the `backend/` folder or the repository root
      // (and also `infra/.env/` if present). We try several candidate paths and use
      // the first one that exists.
      envFilePath: (() => {
        const isProd = process.env.NODE_ENV === 'production';
        const fileName = isProd ? '.prod.env' : '.dev.env';

        const candidates = [
          // project root (when running from repo root)
          path.resolve(process.cwd(), fileName),
          // project root under .env/ (legacy layout)
          path.resolve(process.cwd(), '.env', fileName),
          // backend folder (when running with working dir = backend)
          path.resolve(process.cwd(), 'backend', fileName),
          // relative to this file's location (dist or src)
          path.resolve(__dirname, '..', fileName),
          path.resolve(__dirname, '..', '..', fileName),
          // infra folder layout
          path.resolve(process.cwd(), 'infra', '.env', fileName),
        ];

        for (const p of candidates) {
          if (fs.existsSync(p)) return p;
        }
        // fallback to default (let ConfigModule attempt to load no file)
        return undefined;
      })(),
    }),
    LoggerModule.register(),
    DatabaseModule,
    AuthModule,
    UsersModule,
    NoteModule,
  ],

  controllers: [AppController, StatusController, NoteController, AuthController],
  providers: [AppService, NoteService, DatabaseModule],
})
export class AppModule {}
