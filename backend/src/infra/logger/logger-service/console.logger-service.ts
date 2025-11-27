import { Injectable } from '@nestjs/common';
import { ILoggerService } from './interface/logger-service.interface';

@Injectable()
export class ConsoleLoggerService implements ILoggerService {
  log(message: string, context: string): void {
    console.log(`Log: [` + context + `] :` + message);
  }
  error(message: string, context: string): void {
    console.log(`Error: [` + context + `] :` + message);
  }
  warn(message: string, context: string): void {
    console.log(`Warning: [` + context + `] :` + message);
  }
}
