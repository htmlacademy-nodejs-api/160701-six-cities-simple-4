import RestApplication from './app/rest.js';
import PinoService from './core/logger/pino.service.js';

async function bootstrap() {
  const logger = new PinoService();

  const app = new RestApplication(logger);
  await app.init();
}
bootstrap();
