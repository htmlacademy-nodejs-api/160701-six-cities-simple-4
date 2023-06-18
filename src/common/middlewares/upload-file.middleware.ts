import { NextFunction, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import multer, { diskStorage } from 'multer';
import mime from 'mime-types';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import HttpError from '../../core/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';

const FILE_MAX_SIZE = 10 * 1024 * 1024;
const FileMIMETypes = {
  image: ['image/jpeg', 'image/png'],
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
      maxFiles?: number;
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
      maxFiles = Infinity
    } = this.config;
    const paramId = req.params[param] || '';
    const postFixPath = postFixDirectory ? `/${postFixDirectory}` : '';
    const storage = diskStorage({
      destination: `${uploadDirectory}/${paramId}${postFixPath}`,
      filename: (_req, file, callback) => {
        const extension = mime.extension(file.mimetype);
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
          return next(
            new HttpError(StatusCodes.BAD_REQUEST, `Only ${types.join(', ')} files are allowed!`, className),
          );
        }
      }

      return cb(null, true);
    };
    const uploadFileMiddleware = multer({
      storage,
      fileFilter,
      limits: {
        fileSize: FILE_MAX_SIZE,
        files: isMulti ? maxFiles : 1,
      },
    })[isMulti ? 'array' : 'single'](fieldName);

    uploadFileMiddleware(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        return next(new HttpError(StatusCodes.BAD_REQUEST, err.message, className));
      }

      if (err) {
        return next();
      }

      return next();
    });
  }
}
