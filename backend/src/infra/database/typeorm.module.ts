
import { Module } from '@nestjs/common';
import { databaseProviders } from './typeorm.providers';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
