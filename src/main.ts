import 'reflect-metadata';
import RestApplication from './app/rest.js';
import { AppComponent } from './types/app-component.enum.js';
import { createRestApplicationContainer } from './app/rest.container.js';
import { Container } from 'inversify';

async function bootstrap() {
  const mainContainer = Container.merge(createRestApplicationContainer());
  const app = mainContainer.get<RestApplication>(AppComponent.RestApplication);
  await app.init();
}
bootstrap();
