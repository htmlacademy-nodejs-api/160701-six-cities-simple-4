import { ExceptionFilterInterface } from './common/exception-filter.interface.js';
import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { createErrorObject } from '../helpers/index.js';
import { ServiceError } from '../../types/service-error.enum.js';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { ExceptionFilter } from './common/exception-filter.abstract.js';

@injectable()
export default class ValidationEnityExceptionFilter
  extends ExceptionFilter
  implements ExceptionFilterInterface
{
  constructor(@inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface) {
    super();
    this.logger.info('Register ValidationEnityExceptionFilter');
  }

  public catch(error: unknown, req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof mongoose.Error.ValidationError)) {
      return next(error);
    }
    const message = this.getLoggerMessage({
      name: 'ValidationEntityError',
      message: error.message,
      req,
    });
    this.logger.error(message);

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ServiceError.ValidationEntityError, error.message));
  }
}
