import { Logger } from '@nestjs/common';
import { LoggerAPI } from './LoggerAPI';

export class NestJsLoggerImpl implements LoggerAPI {
  log(message: string, objects?: any[]): void {
    throw new Error('Method not implemented.');
  }

  info(message: string, objects?: any[]): void {
    // log at warn level because info level logs are not shown
    if (objects?.length > 0) Logger.log(message, objects);
    else Logger.log(message);
  }

  debug(message: string, objects?: any[]): void {
    // log at warn level because info level logs are not shown
    if (objects?.length > 0) Logger.debug(message, objects);
    else Logger.debug(message);
  }

  warn(message: string, objects?: any[]): void {
    if (objects?.length > 0) Logger.warn(message, objects);
    else Logger.warn(message);
  }

  error(message: string, objects?: any[]): void {
    if (objects?.length > 0) Logger.error(message, objects);
    else Logger.error(message);
  }
}
