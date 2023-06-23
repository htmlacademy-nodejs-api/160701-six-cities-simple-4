import * as crypto from 'node:crypto';
import * as jose from 'jose';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { ValidationErrorField } from '../../types/validation-error-field.type';
import { ServiceError } from '../../types/service-error.enum';

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);

  return shaHasher.update(line).digest('hex');
};

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });
}

export function createErrorObject(
  serviceError: ServiceError,
  message: string,
  details: ValidationErrorField[] = [],
) {
  return {
    errorType: serviceError,
    message,
    details: [...details],
  };
}

export async function createJwt(algorith: string, jwtSecret: string, payload: object) {
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: algorith })
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));
}

export function transformErrors(errors: ValidationError[]): ValidationErrorField[] {
  return errors.map(({ property, value, constraints }) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : [],
  }));
}

export function getFullServerPath(host: string, port: number) {
  return `http://${host}:${port}`;
}
