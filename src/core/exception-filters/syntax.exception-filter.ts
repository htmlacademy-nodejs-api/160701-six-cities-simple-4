import { ExceptionFilterInterface } from './exception-filter.interface.js';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { createErrorObject } from '../helpers/index.js';
import { ServiceError } from '../../types/service-error.enum.js';
import { ExceptionFilter } from './exception-filter.abstract.js';

@injectable()
export default class SyntaxExceptionFilter extends ExceptionFilter implements ExceptionFilterInterface {
  constructor(@inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface) {
    super();
    this.logger.info('Register SyntaxExceptionFilter');
  }

  public catch(error: Error, req: Request, res: Response, next: NextFunction) {
    if (!(error instanceof SyntaxError)) {
      return next(error);
    }
    const message = this.getLoggerMessage({ name: error.name, message: error.message, req });
    this.logger.error(message);

    res.status(StatusCodes.BAD_REQUEST).json(createErrorObject(ServiceError.SyntaxError, error.message));
  }
}
