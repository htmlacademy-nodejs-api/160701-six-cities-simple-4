import { injectable, inject } from 'inversify';
import { Controller } from '../../core/controller/controller.abstract.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface';
import { HttpMethod } from '../../types/http-method.enum.js';
import { Request, Response } from 'express';
import { CityServiceInterface } from './city-service.interface';

@injectable()
export default class CityController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.CityServiceInterface) protected readonly cityService: CityServiceInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for CityController');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const cities = await this.cityService.find();

    this.ok(res, cities);
  }
}
