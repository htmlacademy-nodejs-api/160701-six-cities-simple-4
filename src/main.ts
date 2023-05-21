import 'reflect-metadata';
import RestApplication from './app/rest.js';
import { AppComponent } from './types/app-component.enum.js';
import { createRestApplicationContainer } from './app/rest.container.js';
import { Container } from 'inversify';
import { createUserContainer } from './modules/user/user.container.js';

async function bootstrap() {
  const mainContainer = Container.merge(createRestApplicationContainer(), createUserContainer());
  const app = mainContainer.get<RestApplication>(AppComponent.RestApplication);
  await app.init();
}
bootstrap();
