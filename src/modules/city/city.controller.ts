import { injectable, inject } from 'inversify';
import { Controller } from '../../core/controller/controller.abstract.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface';
import { HttpMethod } from '../../types/http-method.enum.js';
import { Request, Response } from 'express';
import { CityServiceInterface } from './city-service.interface';
import { fillDTO } from '../../core/helpers/index.js';
import CityRdo from './rdo/city.rdo.js';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import * as core from 'express-serve-static-core';
import { RequestQuery } from '../../types/request-query.type.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import CreateCityDto from './dto/create-city.dto.js';
import HttpError from '../../core/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import OfferRdo from '../offer/rdo/offer.rdo.js';

type ParamsGetCity = {
  cityId: string;
};
@injectable()
export default class CityController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.CityServiceInterface) protected readonly cityService: CityServiceInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for CityController');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateCityDto)],
    });
    this.addRoute({
      path: '/:cityId/offers',
      method: HttpMethod.Get,
      handler: this.getOffersFromCity,
      middlewares: [
        new ValidateObjectIdMiddleware('cityId'),
        new DocumentExistsMiddleware(this.cityService, 'City', 'cityId'),
      ],
    });
    this.addRoute({
      path: '/:cityId/offers/premium',
      method: HttpMethod.Get,
      handler: this.getPremium,
      middlewares: [
        new ValidateObjectIdMiddleware('cityId'),
        new DocumentExistsMiddleware(this.cityService, 'City', 'cityId'),
      ],
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const cities = await this.cityService.find();

    this.ok(res, fillDTO(CityRdo, cities));
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateCityDto>,
    res: Response,
  ): Promise<void> {
    const existCity = await this.cityService.findByCityName(body.name);

    if (existCity) {
      throw new HttpError(StatusCodes.CONFLICT, `City with name «${body.name}» exists.`, 'CityController');
    }
    const newCity = await this.cityService.create(body);

    this.created(res, fillDTO(CityRdo, newCity));
  }

  public async getOffersFromCity(
    { params, query }: Request<core.ParamsDictionary | ParamsGetCity, unknown, unknown, RequestQuery>,
    res: Response,
  ): Promise<void> {
    const offers = await this.offerService.findByCityId(params.cityId, query.limit);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async getPremium({ params }: Request<core.ParamsDictionary | ParamsGetCity>, res: Response) {
    const { cityId } = params;
    const offers = await this.offerService.findPremium(cityId);

    this.ok(res, fillDTO(OfferRdo, offers));
  }
}
