import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  WinstonLoggerService,
  WinstonLoggerOptions,
} from './logger-service/winston.logger-service';
import { ConsoleLoggerService } from './logger-service/console.logger-service';

export const LOGGER = Symbol('Logger');

@Global()
@Module({})
export class LoggerModule {
  static register(): DynamicModule {
    return {
      global: true,
      module: LoggerModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: LOGGER,
          useFactory: (config: ConfigService) => {
            // Choose logger implementation using environment variables.
            // Prefer explicit `USE_WINSTON=true` or `LOGGER=winston`.
            const useWinston =
              (config.get<string>('USE_WINSTON') || '').toLowerCase() ===
                'true' ||
              (config.get<string>('LOGGER') || '').toLowerCase() === 'winston';

            if (useWinston) {
              const logFile = config.get<string>('LOG_FILE');
              const options: WinstonLoggerOptions = {
                level: config.get<string>('LOG_LEVEL') || undefined,
                console: config.get<string>('LOG_CONSOLE') !== 'false',
                format:
                  (config.get<string>('LOG_FORMAT') as 'json' | 'pretty') ||
                  undefined,
                file: logFile ? { filename: logFile } : undefined,
                defaultMeta: undefined,
              };
              return new WinstonLoggerService(options);
            }

            return new ConsoleLoggerService();
          },
          inject: [ConfigService],
        },
      ],
      exports: [LOGGER],
    };
  }
}
