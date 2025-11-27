import * as winston from 'winston';
import { Injectable } from '@nestjs/common';
import { ILoggerService } from './interface/logger-service.interface';

export interface WinstonLoggerOptions {
  level?: string;
  console?: boolean;
  file?: {
    filename: string;
    level?: string;
    maxsize?: number;
    maxFiles?: number;
  };
  format?: 'json' | 'pretty';
  defaultMeta?: Record<string, unknown>;
}

@Injectable()
export class WinstonLoggerService implements ILoggerService {
  private logger: winston.Logger;

  constructor(options: WinstonLoggerOptions = {}) {
    const level = options.level ?? process.env.LOG_LEVEL ?? 'info';

    const formats: winston.Logform.Format[] = [];

    if (options.format === 'json') {
      formats.push(winston.format.timestamp(), winston.format.json());
    } else {
      formats.push(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? ` ${JSON.stringify(meta)}`
            : '';
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          return `${timestamp} [${level}] ${message}${metaStr}`;
        }),
      );
    }

    const transports: winston.transport[] = [];
    if (options.console ?? true) {
      transports.push(new winston.transports.Console({ level }));
    }
    if (options.file?.filename) {
      transports.push(
        new winston.transports.File({
          filename: options.file.filename,
          level: options.file.level ?? level,
          maxsize: options.file.maxsize,
          maxFiles: options.file.maxFiles,
        }),
      );
    }

    this.logger = winston.createLogger({
      level,
      defaultMeta: options.defaultMeta,
      format: winston.format.combine(...formats),
      transports,
      exitOnError: false,
    });
  }

  private formatMessage(message: string, context?: string): string {
    return context ? `[${context}] ${message}` : message;
  }

  // Only implement the interface methods (example: log, error, warn)
  log(message: string, context?: string): void {
    this.logger.info(this.formatMessage(message, context));
  }

  error(message: string, trace?: string, context?: string): void {
    const msg = this.formatMessage(message, context);
    if (trace) {
      this.logger.error(msg, { trace });
    } else {
      this.logger.error(msg);
    }
  }

  warn(message: string, context?: string): void {
    this.logger.warn(this.formatMessage(message, context));
  }
}

export default WinstonLoggerService;
