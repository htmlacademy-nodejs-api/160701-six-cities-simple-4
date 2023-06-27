import { StatusCodes } from 'http-status-codes';
import { ValidationErrorField } from '../../types/validation-error-field.type.js';

export default class ValidationDtoError extends Error {
  public httpStatusCode!: number;
  public details: ValidationErrorField[] = [];

  constructor(errors: ValidationErrorField[]) {
    super();
    this.name = 'ValidationDtoError';
    this.httpStatusCode = StatusCodes.BAD_REQUEST;
    this.details = errors;
  }
}
