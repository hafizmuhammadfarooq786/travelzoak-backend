import { Catch, Inject, Injectable } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core'; // It is a class provided by nestjs to capture and report exceptions.
import { ErrorHandlerAPI } from './error-handler.interface';
@Injectable()
@Catch() // This filter will catch all types of exceptions that are thrown within the application.
export class SentryService extends BaseExceptionFilter {
  constructor(
    @Inject('ErrorHandlerAPI') private readonly errorHandler: ErrorHandlerAPI,
  ) {
    super();
  }

  captureException(exception: any): void {
    this.errorHandler.captureException(exception);
  }
}
