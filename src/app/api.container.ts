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

export function createApiApplicationContainer() {
  const ApiApplicationContainer = new Container();

  ApiApplicationContainer.bind<ApiApplication>(AppComponent.RestApplication)
    .to(ApiApplication)
    .inSingletonScope();
  ApiApplicationContainer.bind<ConfigInterface<RestSchema>>(AppComponent.ConfigInterface)
    .to(ConfigService)
    .inSingletonScope();
  ApiApplicationContainer.bind<LoggerInterface>(AppComponent.LoggerInterface)
    .to(PinoService)
    .inSingletonScope();
  ApiApplicationContainer.bind<DatabaseClientInterface>(AppComponent.DatabaseClientInterface)
    .to(MongoClientService)
    .inSingletonScope();

  return ApiApplicationContainer;
}
