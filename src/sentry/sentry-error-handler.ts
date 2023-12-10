import * as Sentry from '@sentry/node';
import { ErrorHandlerAPI } from './error-handler.interface';

export class SentryErrorHandler implements ErrorHandlerAPI {
  captureException(exception: any): void {
    Sentry.captureException(exception);
  }
}
