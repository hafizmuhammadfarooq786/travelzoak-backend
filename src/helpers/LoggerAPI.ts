export interface LoggerAPI {
  log(message: string, objects?: any[]): void;
  debug(message: string, objects?: any[]): void;
  warn(message: string, objects?: any[]): void;
  error(message: string, objects?: any[]): void;
}
