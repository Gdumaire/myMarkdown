import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { userProviders } from './users.providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/infra/database/typeorm.module';
import { UsersController } from './users.controller';

@Module({
  imports: [ TypeOrmModule, DatabaseModule ],
  providers: [...userProviders, UsersService],
  exports: [...userProviders, UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
