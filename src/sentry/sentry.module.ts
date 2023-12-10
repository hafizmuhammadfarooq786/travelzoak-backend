import { Module } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { SentryErrorHandler } from './sentry-error-handler';
import { SentryService } from './sentry.service';

@Module({
  providers: [
    SentryService,
    { provide: 'ErrorHandlerAPI', useClass: SentryErrorHandler },
  ],
  exports: [SentryService],
})
export class SentryModule {
  constructor() {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
    });
  }
}
