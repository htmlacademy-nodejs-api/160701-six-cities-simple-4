import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from '../../core/controller/controller.abstract.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { ConfigInterface } from '../../core/config/config.interface.js';
import { RestSchema } from '../../core/config/rest.schema.js';
import { UserServiceInterface } from './user-service.interface.js';
import HttpError from '../../core/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { createJwt, fillDTO } from '../../core/helpers/common.js';
import UserRdo from './rdo/created-user.rdo.js';
import CreateUserDto from './dto/create-user.dto.js';
import LoginUserDto from './dto/login-user.dto.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import {
  UploadFileMiddleware,
  getFileValidationMessages,
} from '../../common/middlewares/upload-file.middleware.js';
import { JWT_ALGORITHM } from './user.constant.js';
import LoggedUserRdo from './rdo/logged-user.rdo.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import FavoritesUserRdo from './rdo/favorites-user.rdo.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import { ParamsGetOffer } from '../offer/offer.controller.js';
import * as core from 'express-serve-static-core';
import UploadUserAvatarRdo from './rdo/upload-user-avatar.rdo.js';
import { UserExistsMiddleware } from '../../common/middlewares/user-exists.middleware.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface) configService: ConfigInterface<RestSchema>,
    @inject(AppComponent.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger, configService);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
    });
    this.addRoute({
      path: '/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new UploadFileMiddleware({
          fieldName: 'avatar',
          uploadDirectory: `${this.configService.get('UPLOAD_DIRECTORY')}/users`,
          postFixDirectory: 'avatar',
          fileType: 'image',
        }),
      ],
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware(), new UserExistsMiddleware(this.userService)],
    });
    this.addRoute({
      path: '/favorites/add/:offerId',
      method: HttpMethod.Post,
      handler: this.addFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new UserExistsMiddleware(this.userService),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/favorites/remove/:offerId',
      method: HttpMethod.Delete,
      handler: this.removeFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new UserExistsMiddleware(this.userService),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async create(
    { body, user }: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response,
  ): Promise<void> {
    if (user) {
      throw new HttpError(StatusCodes.CONFLICT, 'Only for Unauthorized', 'UserController');
    }
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(StatusCodes.CONFLICT, `User with email «${body.email}» exists.`, 'UserController');
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.verifyUser(body, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'UserController');
    }
    const { email, id } = user;

    const token = await createJwt(JWT_ALGORITHM, this.configService.get('JWT_SECRET'), {
      email,
      id,
    });

    this.ok(res, fillDTO(LoggedUserRdo, { ...user.toObject(), token }));
  }

  public async uploadAvatar({ user, file }: Request, res: Response) {
    if (!file?.path) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        getFileValidationMessages({ typeMessage: 'required', fileType: 'image' }),
        'OfferController',
      );
    }
    const { id } = user;
    const updateDto = { avatarPath: file.filename };
    await this.userService.updateById(id, updateDto);

    this.created(res, fillDTO(UploadUserAvatarRdo, updateDto));
  }

  public async checkAuthenticate({ user }: Request, res: Response) {
    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'UserController');
    }
    const { email } = user;
    const foundedUser = await this.userService.findByEmail(email);

    this.ok(res, fillDTO(LoggedUserRdo, foundedUser));
  }

  public async addFavorites(
    { user: { email }, params }: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response,
  ) {
    const { offerId } = params;
    const favorites = await this.userService.addFavorites(email, offerId);

    this.ok(res, fillDTO(FavoritesUserRdo, favorites));
  }

  public async removeFavorites(
    { user: { email }, params }: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response,
  ) {
    const { offerId } = params;
    const favorites = await this.userService.removeFavorites(email, offerId);

    this.ok(res, fillDTO(FavoritesUserRdo, favorites));
  }

  public async getFavorites(
    { user: { email }, params }: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response,
  ) {
    const { offerId } = params;
    const favorites = await this.userService.removeFavorites(email, offerId);

    this.ok(res, fillDTO(FavoritesUserRdo, favorites));
  }
}
