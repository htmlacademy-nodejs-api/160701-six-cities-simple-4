import { MiddlewareInterface } from '../../types/middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import { DocumentExistsInterface } from '../../types/document-exists.interface.js';
import { StatusCodes } from 'http-status-codes';
import HttpError from '../../core/errors/http-error.js';
import { DocumentCreatedByUserInterface } from '../../types/document-created-by-user.interface.js';

export class DocumentCreatedByUserMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: DocumentCreatedByUserInterface & DocumentExistsInterface,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public async execute({ params, user }: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];

    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'DocumentCreatedByUserMiddleware');
    }
    if (!(await this.service.exists(documentId))) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${documentId} not found.`,
        'DocumentCreatedByUserMiddleware',
      );
    }
    if (!(await this.service.createdByUser(documentId, user.id))) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Access to a user with an ID:${user.id} is denied`,
        'DocumentCreatedByUserMiddleware',
      );
    }

    return next();
  }
}
