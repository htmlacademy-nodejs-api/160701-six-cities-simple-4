import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { Controller } from '../../core/controller/controller.abstract.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface';
import { HttpMethod } from '../../types/http-method.enum.js';
import HttpError from '../../core/errors/http-error.js';
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

export type ParamsGetOffer = {
  offerId: string;
};

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(AppComponent.CityServiceInterface) private readonly cityService: CityServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
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
    { query }: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>,
    res: Response,
  ) {
    const limit = query.limit;
    const offers = await this.offerService.find(limit);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response,
  ): Promise<void> {
    const cityName = body.city;
    const city = await this.cityService.findByCityNameOrCreate(cityName, { name: cityName });
    console.log('cityID', city.id);

    const result = await this.offerService.create({ ...body, city: city.id });
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async delete(
    { params }: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);

    this.noContent(res, offer);
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
}
