import { injectable, inject } from 'inversify';
import { Controller } from '../../core/controller/controller.abstract.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface';
import { HttpMethod } from '../../types/http-method.enum.js';
import { Request, Response } from 'express';
import { CityServiceInterface } from './city-service.interface';
import { fillDTO } from '../../core/helpers/index.js';
import CityRdo from './rdo/city.rdo.js';
import CreateCityDto from './dto/create-city.dto.js';
import HttpError from '../../core/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import { ConfigInterface } from '../../core/config/config.interface.js';
import { RestSchema } from '../../core/config/rest.schema.js';

@injectable()
export default class CityController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.CityServiceInterface) protected readonly cityService: CityServiceInterface,
    @inject(AppComponent.ConfigInterface) configService: ConfigInterface<RestSchema>,
  ) {
    super(logger, configService);
    this.logger.info('Register routes for CityController');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateCityDto)],
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
    const cityName = body.name;
    const existCity = await this.cityService.findByCityName(cityName);

    if (existCity) {
      throw new HttpError(StatusCodes.CONFLICT, `City with name «${cityName}» exists.`, 'CityController');
    }

    const newCity = await this.cityService.create(body);

    this.created(res, fillDTO(CityRdo, newCity));
  }
}
