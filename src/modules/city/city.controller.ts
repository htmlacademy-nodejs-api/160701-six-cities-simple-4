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
    this.addRoute({ path: '/:cityId/offers', method: HttpMethod.Get, handler: this.getOffersFromCity });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const cities = await this.cityService.find();

    this.ok(res, fillDTO(CityRdo, cities));
  }

  public async getOffersFromCity(
    { params, query }: Request<core.ParamsDictionary | ParamsGetCity, unknown, unknown, RequestQuery>,
    res: Response,
  ): Promise<void> {
    const offers = await this.offerService.findByCityId(params.cityId, query.limit);
    this.ok(res, fillDTO(OfferRdo, offers));
  }
}
