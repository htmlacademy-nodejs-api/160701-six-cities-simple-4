import { injectable, inject } from 'inversify';
import { Controller } from '../../core/controller/controller.abstract';
import { AppComponent } from '../../types/app-component.enum';
import { LoggerInterface } from '../../core/logger/logger.interface';
import { HttpMethod } from '../../types/http-method.enum.js';
import { Request, Response } from 'express';

@injectable()
export default class CityController extends Controller {
  constructor(@inject(AppComponent.LoggerInterface) logger: LoggerInterface) {
    super(logger);
    this.logger.info('Register routes for CityController');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
  }

  public index(req: Request, res: Response): void {
    // Код обработчика
  }
}
