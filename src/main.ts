import 'reflect-metadata';
import ApiApplication from './app/api.js';
import { AppComponent } from './types/app-component.enum.js';
import { createApiApplicationContainer } from './app/api.container.js';
import { Container } from 'inversify';
import { createUserContainer } from './modules/user/user.container.js';
import { createOfferContainer } from './modules/offer/offer.container.js';
import { createCommentContainer } from './modules/comment/comment.container.js';

async function bootstrap() {
  const mainContainer = Container.merge(
    createApiApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
  );
  const app = mainContainer.get<ApiApplication>(AppComponent.RestApplication);
  await app.init();
}
bootstrap();
