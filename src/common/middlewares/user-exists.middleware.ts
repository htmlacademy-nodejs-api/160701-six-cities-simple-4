import { MiddlewareInterface } from '../../types/middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import { DocumentExistsInterface } from '../../types/document-exists.interface.js';
import { StatusCodes } from 'http-status-codes';
import HttpError from '../../core/errors/http-error.js';

export class UserExistsMiddleware implements MiddlewareInterface {
  constructor(private readonly service: DocumentExistsInterface) {}

  public async execute({ user: { id } }: Request, _res: Response, next: NextFunction): Promise<void> {
    if (!(await this.service.exists(id))) {
      throw new HttpError(StatusCodes.NOT_FOUND, `User with ${id} not found.`, 'UserExistsMiddleware');
    }

    next();
  }
}
