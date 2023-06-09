import * as crypto from 'node:crypto';
import * as jose from 'jose';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { ValidationErrorField } from '../../types/validation-error-field.type';
import { ServiceError } from '../../types/service-error.enum';
import { UnknownRecord } from '../../types/unknown-record.type.js';
import { DEFAULT_STATIC_IMAGES } from '../../app/app.constant.js';

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

function isObject(value: unknown) {
  return typeof value === 'object' && value !== null;
}

export function transformProperty(
  property: string,
  someObject: UnknownRecord,
  transformFn: (object: UnknownRecord) => void,
) {
  return Object.keys(someObject).forEach((key) => {
    if (key === property) {
      transformFn(someObject);
    } else if (isObject(someObject[key])) {
      transformProperty(property, someObject[key] as UnknownRecord, transformFn);
    }
  });
}

export function transformObject(
  properties: { property: string; path: string }[],
  staticPath: string,
  uploadPath: string,
  data: UnknownRecord,
) {
  return properties.forEach(({ property, path }) => {
    transformProperty(property, data, (target: UnknownRecord) => {
      const value = target[property];
      const isArray = Array.isArray(value);
      const isStatic = DEFAULT_STATIC_IMAGES.includes(isArray ? value[0] : String(value));
      const rootPath = isStatic ? staticPath : uploadPath;
      const newPath = !isStatic ? `${path.replace(':id', String(target.id))}/` : '';

      if (!value) {
        target[property] = '';

        return;
      }
      if (isArray) {
        target[property] = value.map((el) => `${rootPath}/${newPath}${el}`);
      } else {
        target[property] = `${rootPath}/${newPath}${value}`;
      }
    });
  });
}

export function isUnknownRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}
