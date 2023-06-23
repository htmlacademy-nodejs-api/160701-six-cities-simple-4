import { ExceptionFilterInterface } from './exception-filter.interface.js';
import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import ValidationError from '../errors/validation-error.js';
import { createErrorObject } from '../helpers/index.js';
import { ServiceError } from '../../types/service-error.enum.js';

@injectable()
export default class ValidationExceptionFilter implements ExceptionFilterInterface {
  constructor(@inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface) {
    this.logger.info('Register ValidationExceptionFilter');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof ValidationError)) {
      return next(error);
    }

    const errorDetails = error.details.map(
      (errorField) => `[${errorField.property}] — ${errorField.messages}`,
    );

    this.logger.error(`[ValidationException]: ${error.message}, Details: [${errorDetails}]`);

    res
      .status(error.httpStatusCode)
      .json(createErrorObject(ServiceError.ValidationError, error.message, error.details));
  }
}
