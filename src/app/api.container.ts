import { Container } from 'inversify';
import { ConfigInterface } from '../core/config/config.interface.js';
import { RestSchema } from '../core/config/rest.schema.js';
import { LoggerInterface } from '../core/logger/logger.interface.js';
import MongoClientService from '../core/database-client/mongo-client.service.js';
import { DatabaseClientInterface } from '../core/database-client/databese-client.interface.js';
import ConfigService from '../core/config/config.service.js';
import PinoService from '../core/logger/pino.service.js';
import { AppComponent } from '../types/app-component.enum.js';
import ApiApplication from './api.js';
import { ExceptionFilterInterface } from '../core/exception-filters/exception-filter.interface.js';
import HttpErrorExceptionFilter from '../core/exception-filters/http-error.exception-filter.js';
import ValidationExceptionFilter from '../core/exception-filters/validation.exception-filter.js';
import BaseExceptionFilter from '../core/exception-filters/base.exception-filter.js';
import SyntaxExceptionFilter from '../core/exception-filters/syntax.exception-filter.js';

export function createApiApplicationContainer() {
  const apiApplicationContainer = new Container();

  apiApplicationContainer
    .bind<ApiApplication>(AppComponent.RestApplication)
    .to(ApiApplication)
    .inSingletonScope();
  apiApplicationContainer
    .bind<ConfigInterface<RestSchema>>(AppComponent.ConfigInterface)
    .to(ConfigService)
    .inSingletonScope();
  apiApplicationContainer
    .bind<LoggerInterface>(AppComponent.LoggerInterface)
    .to(PinoService)
    .inSingletonScope();
  apiApplicationContainer
    .bind<DatabaseClientInterface>(AppComponent.DatabaseClientInterface)
    .to(MongoClientService)
    .inSingletonScope();
  apiApplicationContainer
    .bind<ExceptionFilterInterface>(AppComponent.HttpErrorExceptionFilter)
    .to(HttpErrorExceptionFilter)
    .inSingletonScope();
  apiApplicationContainer
    .bind<ExceptionFilterInterface>(AppComponent.ValidationExceptionFilter)
    .to(ValidationExceptionFilter)
    .inSingletonScope();
  apiApplicationContainer
    .bind<ExceptionFilterInterface>(AppComponent.BaseExceptionFilter)
    .to(BaseExceptionFilter)
    .inSingletonScope();
  apiApplicationContainer
    .bind<ExceptionFilterInterface>(AppComponent.SyntaxExceptionFilter)
    .to(SyntaxExceptionFilter)
    .inSingletonScope();

  return apiApplicationContainer;
}
