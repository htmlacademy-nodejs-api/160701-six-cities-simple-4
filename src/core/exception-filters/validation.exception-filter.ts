import { ExceptionFilterInterface } from './exception-filter.interface.js';
import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import ValidationError from '../errors/validation-error.js';
import { createErrorObject } from '../helpers/index.js';
import { ServiceError } from '../../types/service-error.enum.js';
import { ExceptionFilter } from './exception-filter.abstract.js';

@injectable()
export default class ValidationExceptionFilter extends ExceptionFilter implements ExceptionFilterInterface {
  constructor(@inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface) {
    super();
    this.logger.info('Register ValidationExceptionFilter');
  }

  public catch(error: unknown, req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof ValidationError)) {
      return next(error);
    }

    const errorDetails = error.details.map(
      (errorField) => `[${errorField.property}] — ${errorField.messages}`,
    );
    const message = this.getLoggerMessage({
      name: error.name,
      message: error.message,
      details: errorDetails,
      req,
    });
    this.logger.error(message);

    res
      .status(error.httpStatusCode)
      .json(createErrorObject(ServiceError.ValidationError, error.message, error.details));
  }
}
