import { ExceptionFilterInterface } from './common/exception-filter.interface.js';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { createErrorObject } from '../helpers/index.js';
import { ServiceError } from '../../types/service-error.enum.js';
import { ExceptionFilter } from './common/exception-filter.abstract.js';

@injectable()
export default class BaseExceptionFilter extends ExceptionFilter implements ExceptionFilterInterface {
  constructor(@inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface) {
    super();
    this.logger.info('Register BaseExceptionFilter');
  }

  public catch(error: Error, req: Request, res: Response, _next: NextFunction) {
    const message = this.getLoggerMessage({ name: 'BaseException', message: error.message, req });

    this.logger.error(message);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ServiceError.ServiceError, error.message));
  }
}
