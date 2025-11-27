import { ConfigModule, ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import { DataSource } from 'typeorm';

export const databaseProviders = [
    {
        inject: [ConfigService],
        provide: 'DATA_SOURCE',
        useFactory: async (config: ConfigService) => {
        const dataSource = new DataSource({
            type: 'postgres',
            host: config.get<string>('DB_HOST'),
            port: config.get<number>('DB_PORT'),
            username: config.get<string>('DB_USERNAME'),
            password: config.get<string>('DB_PASS'),
            database: config.get<string>('DB_NAME'),
            entities: [
                __dirname + '/./entities/*.js',
            ],
            synchronize: false,
        });

        return dataSource.initialize();
        },
    }
];