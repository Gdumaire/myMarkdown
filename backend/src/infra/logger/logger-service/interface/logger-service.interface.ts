export interface ILoggerService {
  log(message: string, context?: string): void;
  error(message: string, context?: string): void;
  warn(message: string, context?: string): void;
}
