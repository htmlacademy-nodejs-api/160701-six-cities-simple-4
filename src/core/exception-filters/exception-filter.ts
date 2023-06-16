import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { ExceptionFilterInterface } from './exception-filter.interface.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { createErrorObject } from '../helpers/index.js';
import HttpError from '../errors/http-error.js';

@injectable()
export default class ExceptionFilter implements ExceptionFilterInterface {
  constructor(@inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface) {
    this.logger.info('Register ExceptionFilter');
  }

  private handleValidationError(error: Error, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(`[ValidationError]: ${error.message}`);
    res.status(StatusCodes.BAD_REQUEST).json(createErrorObject(error.message));
  }

  private handleSintaxError(error: SyntaxError, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(`[${error.name}]: ${error.message}`);
    res.status(StatusCodes.BAD_REQUEST).json(createErrorObject(error.message));
  }

  private handleHttpError(error: HttpError, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(`[${error.detail}]: ${error.httpStatusCode} — ${error.message}`);
    res.status(error.httpStatusCode).json(createErrorObject(error.message));
  }

  private handleOtherError(error: Error, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createErrorObject(error.message));
  }

  public catch(error: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
    if (error.constructor.name === 'ValidationError') {
      return this.handleValidationError(error, req, res, next);
    }

    if (error instanceof SyntaxError) {
      return this.handleSintaxError(error, req, res, next);
    }

    if (error instanceof HttpError) {
      return this.handleHttpError(error, req, res, next);
    }

    this.handleOtherError(error, req, res, next);
  }
}
