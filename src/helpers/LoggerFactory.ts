import { LoggerAPI } from './LoggerAPI';
import { NestJsLoggerImpl } from './NestJsLoggerImpl';
import WatchLogger from './WatchLogger';

class LoggerFactory {
  private static logger: LoggerAPI | null = null;

  static getLogger(): LoggerAPI {
    if (!this.logger) {
      this.logger = createLoggerInstance();
    }
    return this.logger;
  }
}

/**
 * Set to true to use the local logger, false to use the cloudwatch logger
 */
const USE_LOCAL_LOGGER = true;

/**
 * Create a logger instance based on the environment
 *
 * @returns a LoggerAPI instance
 */
function createLoggerInstance(): LoggerAPI {
  if (USE_LOCAL_LOGGER) {
    return new NestJsLoggerImpl();
  } else {
    return new WatchLogger();
  }
}

export default LoggerFactory;
