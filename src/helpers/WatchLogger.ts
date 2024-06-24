import { LoggerAPI } from './LoggerAPI';

class WatchLogger implements LoggerAPI {
  constructor() {}
  log(message: string, objects?: any[]): void {
    throw new Error('Method not implemented.');
  }

  private putLogToCloudWatch(
    logLevel: string,
    message: string,
    objects?: any[],
  ) {
    const logTimestamp = new Date().getTime();
    // message has to be a string
    const logEvents = [
      { message: JSON.stringify(message), timestamp: logTimestamp },
    ];

    if (objects) {
      logEvents.push({
        message: JSON.stringify(objects),
        timestamp: logTimestamp,
      });
    }

    console.log(`Logging PARAMS: (${logLevel}):`, logEvents);
  }

  info(message: string, objects?: any[]) {
    this.putLogToCloudWatch('INFO', message, objects);
  }

  debug(message: string, objects?: any[]) {
    this.putLogToCloudWatch('DEBUG', message, objects);
  }

  warn(message: string, objects?: any[]) {
    this.putLogToCloudWatch('WARN', message, objects);
  }

  error(message: string, objects?: any[]) {
    this.putLogToCloudWatch('ERROR', message, objects);
  }
}

export default WatchLogger;
