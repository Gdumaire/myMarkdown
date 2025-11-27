
import { DataSource } from 'typeorm';
import { User } from '../infra/database/entities/User';

export const USER_MODULE = {
  userService: Symbol('USER_REPOSITORY')
}

export const userProviders = [
  {
    provide: USER_MODULE.userService,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
];
