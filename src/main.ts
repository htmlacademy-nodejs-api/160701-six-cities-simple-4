import 'reflect-metadata';
import { Container } from 'inversify';
import RestApplication from './app/rest.js';
import ConfigService from './core/config/config.service.js';
import PinoService from './core/logger/pino.service.js';
import { AppComponent } from './types/app-component.enum.js';
import { ConfigInterface } from './core/config/config.interface.js';
import { RestSchema } from './core/config/rest.schema.js';
import { LoggerInterface } from './core/logger/logger.interface.js';

async function bootstrap() {
  const container = new Container();
  container.bind<RestApplication>(AppComponent.RestApplication).to(RestApplication).inSingletonScope();
  container
    .bind<ConfigInterface<RestSchema>>(AppComponent.ConfigInterface)
    .to(ConfigService)
    .inSingletonScope();
  container.bind<LoggerInterface>(AppComponent.LoggerInterface).to(PinoService).inSingletonScope();

  const app = container.get<RestApplication>(AppComponent.RestApplication);
  await app.init();
}
bootstrap();
