import { NextFunction, Request, Response } from 'express';
import { ClassConstructor } from 'class-transformer/types/interfaces/class-constructor.type.js';
import { validate } from 'class-validator';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import ValidationDtoError from '../../core/errors/validation-error.js';
import { transformErrors } from '../../core/helpers/index.js';

export class ValidateDtoMiddleware implements MiddlewareInterface {
  constructor(private dto: ClassConstructor<object>) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, req.body, {
      excludeExtraneousValues: true,
    });
    const errors = await validate(dtoInstance);

    if (errors.length) {
      throw new ValidationDtoError(transformErrors(errors));
    }
    req.body = instanceToPlain(dtoInstance);

    next();
  }
}
