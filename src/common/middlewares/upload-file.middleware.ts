import { NextFunction, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import multer, { diskStorage } from 'multer';
import mime from 'mime-types';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import HttpError from '../../core/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';

const FileMIMETypes = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
};
const className = 'UploadFileMiddleware';
export class UploadFileMiddleware implements MiddlewareInterface {
  constructor(
    private config: {
      uploadDirectory: string;
      fieldName: string;
      fileType?: 'image';
      param: string;
      postFixDirectory?: string;
      isMulti?: boolean;
    },
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const {
      param,
      uploadDirectory,
      fieldName,
      postFixDirectory = '',
      isMulti = false,
      fileType,
    } = this.config;
    const paramId = req.params[param] || '';
    const postFixPath = postFixDirectory ? `/${postFixDirectory}` : '';
    const storage = diskStorage({
      destination: `${uploadDirectory}/${paramId}${postFixPath}`,
      filename: (_req, file, callback) => {
        const extension = mime.extension(file.mimetype);

        if (!extension) {
          return next(
            new HttpError(StatusCodes.BAD_REQUEST, `Нераспознан тип файла ${file.originalname}`, className),
          );
        }
        const filename = nanoid();
        callback(null, `${filename}.${extension}`);
      },
    });
    const fileFilter = function (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
      if (fileType) {
        const types = FileMIMETypes[fileType];
        const isValid = types?.some((ext) => file.mimetype === ext);

        if (isValid) {
          return cb(null, true);
        } else {
          return cb(
            new HttpError(StatusCodes.BAD_REQUEST, `Only ${types.join(', ')} files are allowed!`, className),
          );
        }
      }

      return cb(null, true);
    };
    const uploadFileMiddleware = multer({ storage, fileFilter })[isMulti ? 'array' : 'single'](fieldName);

    uploadFileMiddleware(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        return next(new HttpError(StatusCodes.BAD_REQUEST, err.message, className));
      } else if (err) {
        return next(err);
      } else {
        return next();
      }
    });
  }
}