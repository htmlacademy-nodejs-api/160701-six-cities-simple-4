import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { Controller } from '../../core/controller/controller.abstract.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface';
import { HttpMethod } from '../../types/http-method.enum.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import * as core from 'express-serve-static-core';
import { fillDTO } from '../../core/helpers/common.js';
import OfferFullRdo from './rdo/offer-full.rdo.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { CityServiceInterface } from '../city/city-service.interface.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { RequestQuery } from '../../types/request-query.type.js';
import OfferRdo from './rdo/offer.rdo.js';
import {
  UploadFileMiddleware,
  getFileValidationMessages,
} from '../../common/middlewares/upload-file.middleware.js';
import { ConfigInterface } from '../../core/config/config.interface.js';
import { RestSchema } from '../../core/config/rest.schema.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import { UserServiceInterface } from '../user/user-service.interface.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import { UnknownRecord } from '../../types/unknown-record.type.js';
import HttpError from '../../core/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import UploadPreviewRdo from './rdo/upload-preview.rdo.js';
import UploadImagesRdo from './rdo/upload-images.rdo.js';
import { OfferV } from '../../const/validation.js';
import { DocumentCreatedByUserMiddleware } from '../../common/middlewares/document-by-user.middleware.js';
import { ParamsGetCity, ParamsGetOffer, ParamsNames } from '../../types/params.type.js';
import { EntityNames } from '../../types/entity-names.enum.js';

@injectable()
export default class OfferController extends Controller {
  private uploadDirection: string;

  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(AppComponent.ConfigInterface) configService: ConfigInterface<RestSchema>,
    @inject(AppComponent.CityServiceInterface) private readonly cityService: CityServiceInterface,
    @inject(AppComponent.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(AppComponent.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
  ) {
    super(logger, configService);
    this.uploadDirection = `${this.configService.get('UPLOAD_DIRECTORY')}/offers/`;
    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.favorites,
      middlewares: [new PrivateRouteMiddleware()],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware(ParamsNames.OfferId),
        new DocumentExistsMiddleware(this.offerService, EntityNames.Offer, ParamsNames.OfferId),
      ],
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateOfferDto)],
    });
    this.addRoute({
      path: '/:offerId/preview',
      method: HttpMethod.Post,
      handler: this.uploadPreview,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware(ParamsNames.OfferId),
        new DocumentCreatedByUserMiddleware(this.offerService, EntityNames.Offer, ParamsNames.OfferId),
        new UploadFileMiddleware({
          uploadDirectory: this.uploadDirection,
          fieldName: 'offer-preview',
          param: ParamsNames.OfferId,
          postFixDirectory: 'preview',
          fileType: 'image',
        }),
      ],
    });
    this.addRoute({
      path: '/:offerId/images',
      method: HttpMethod.Post,
      handler: this.uploadImages,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware(ParamsNames.OfferId),
        new DocumentCreatedByUserMiddleware(this.offerService, EntityNames.Offer, ParamsNames.OfferId),
        new UploadFileMiddleware({
          uploadDirectory: this.uploadDirection,
          fieldName: 'offer-img',
          fileType: 'image',
          param: ParamsNames.OfferId,
          postFixDirectory: 'images',
          isMulti: true,
          maxFiles: OfferV.Images.Max,
        }),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware(ParamsNames.OfferId),
        new DocumentCreatedByUserMiddleware(this.offerService, EntityNames.Offer, ParamsNames.OfferId),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware(ParamsNames.OfferId),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentCreatedByUserMiddleware(this.offerService, EntityNames.Offer, ParamsNames.OfferId),
      ],
    });
    this.addRoute({
      path: '/city/:cityId',
      method: HttpMethod.Get,
      handler: this.getOffersFromCity,
      middlewares: [
        new ValidateObjectIdMiddleware(ParamsNames.CityId),
        new DocumentExistsMiddleware(this.cityService, EntityNames.City, ParamsNames.CityId),
      ],
    });
    this.addRoute({
      path: '/premium/city/:cityId',
      method: HttpMethod.Get,
      handler: this.getPremium,
      middlewares: [
        new ValidateObjectIdMiddleware(ParamsNames.CityId),
        new DocumentExistsMiddleware(this.cityService, EntityNames.City, ParamsNames.CityId),
      ],
    });
  }

  public async show(
    { params }: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);

    this.ok(res, fillDTO(OfferFullRdo, offer));
  }

  public async index(
    { query, user }: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>,
    res: Response,
  ) {
    const { limit, sortType } = query;
    const defaultOffers = await this.offerService.find({ limit, sortType });
    let favorites: string[] = [];

    if (user) {
      const { email } = user;
      favorites = await this.userService.getFavorites(email);
    }

    const offers = defaultOffers.map((offer) => ({
      ...offer.toObject(),
      isFavorite: favorites.includes(offer.id),
    }));

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async favorites(
    { query, user }: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>,
    res: Response,
  ) {
    const { limit, sortType } = query;

    const { email } = user;
    const favorites = await this.userService.getFavorites(email);
    const defaultOffers = await this.offerService.findFavorites(favorites, { limit, sortType });
    const offers = defaultOffers.map((offer) => ({
      ...offer.toObject(),
      isFavorite: true,
    }));

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create(
    { body, user }: Request<UnknownRecord, UnknownRecord, CreateOfferDto>,
    res: Response,
  ): Promise<void> {
    const cityName = body.city;
    const city = await this.cityService.findByCityNameOrCreate(cityName, { name: cityName });
    const result = await this.offerService.create({
      ...body,
      city: city.id,
      author: user.id,
    });
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async delete(
    { params }: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { offerId } = params;

    Promise.all([
      this.offerService.deleteById(offerId),
      this.commentService.deleteByOfferId(offerId),
      this.userService.clearFavorites(offerId),
    ])
      .then(() => {
        this.noContent(res);
      })
      .catch(next);
  }

  public async update(
    {
      body,
      params,
    }: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, UpdateOfferDto>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const updatedOffer = await this.offerService.updateById(offerId, body);
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async uploadPreview(
    { file, params }: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response,
  ) {
    if (!file?.path) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        getFileValidationMessages({ typeMessage: 'required', fileType: 'image' }),
        'OfferController',
      );
    }
    const { offerId } = params;
    const updateDto = {
      preview: file.filename,
    };
    await this.offerService.updateById(offerId, updateDto);

    this.created(
      res,
      fillDTO(UploadPreviewRdo, {
        ...updateDto,
        id: offerId,
      }),
    );
  }

  public async uploadImages(
    { files, params }: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response,
  ) {
    if (!Array.isArray(files) || !files.length) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        getFileValidationMessages({ typeMessage: 'required', fileType: 'image' }),
        'OfferController',
      );
    }
    if (files.length < OfferV.Images.Min) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        getFileValidationMessages({
          typeMessage: 'minFiles',
          fileType: 'image',
          minFiles: OfferV.Images.Min,
        }),
        'OfferController',
      );
    }
    const { offerId } = params;
    const images = files.filter((file) => file?.path).map((file) => file.filename);

    await this.offerService.updateById(offerId, { images });
    this.created(res, fillDTO(UploadImagesRdo, { images, id: offerId }));
  }

  public async getOffersFromCity(
    { params, query }: Request<core.ParamsDictionary | ParamsGetCity, unknown, unknown, RequestQuery>,
    res: Response,
  ): Promise<void> {
    const { limit, sortType } = query;
    const offers = await this.offerService.findByCityId(params.cityId, { limit, sortType });
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async getPremium(
    { params, query }: Request<core.ParamsDictionary | ParamsGetCity, unknown, unknown, RequestQuery>,
    res: Response,
  ) {
    const { sortType } = query;
    const { cityId } = params;
    const offers = await this.offerService.findPremium(cityId, { sortType });

    this.ok(res, fillDTO(OfferRdo, offers));
  }
}
