import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/infra/database/entities/User';
import { USER_MODULE } from './users.providers';

@Injectable()
export class UsersService {
  constructor(@Inject(USER_MODULE.userService) private userRepository: Repository<User>) {}

  async getUserById(
    uuid: string,
  ): Promise<User | null> {
    return this.userRepository.findOne({
        where: {
            uuid
        },
    });
  }

  async getUserByEmailAndPassword (username:string, password: string): Promise<User | null> {
    return this.userRepository.findOne({
        where: {
            username,
            password
        }
    })
  }

  async createUser (name:string, password:string): Promise<any> {
    const user = await this.userRepository.create({
            username:name,
            password
    });
    return this.userRepository.save(user);
  }
}
