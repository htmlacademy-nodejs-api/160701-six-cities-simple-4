import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { ExceptionFilterInterface } from './common/exception-filter.interface.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { createErrorObject } from '../helpers/index.js';
import HttpError from '../errors/http-error.js';
import { ServiceError } from '../../types/service-error.enum.js';
import { ExceptionFilter } from './common/exception-filter.abstract.js';

@injectable()
export default class HttpErrorExceptionFilter extends ExceptionFilter implements ExceptionFilterInterface {
  constructor(@inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface) {
    super();
    this.logger.info('Register HttpErrorExceptionFilter');
  }

  public catch(error: unknown, req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    const message = this.getLoggerMessage({ name: error.name, message: error.message, req });
    this.logger.error(message);

    res.status(error.httpStatusCode).json(createErrorObject(ServiceError.CommonError, error.message));
  }
}
