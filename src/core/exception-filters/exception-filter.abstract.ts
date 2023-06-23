import { Request } from 'express';
import { injectable } from 'inversify';

type TLoggerMessage = {
  name: string;
  message: string;
  details?: string[];
  req: Request;
};

@injectable()
export abstract class ExceptionFilter {
  public getLoggerMessage({ name, message, req, details }: TLoggerMessage) {
    const detailsStr = details?.length ? `Details: [${details}]` : '';

    return `[${name}]: ${req.method.toUpperCase()} ${req.originalUrl} # ${message} ${detailsStr}`;
  }
}
