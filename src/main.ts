import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { json, urlencoded } from 'body-parser';
import { AppModule } from './app.module';
import { AccessTokenGuard } from './auth/guards/accessToken.guard';
import Constants from './utils/Constants';

export const API_VERSION = 'v1';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`/api/${API_VERSION}`);
  // TODO: add PROD URL when deployed
  app.enableCors({
    origin: [Constants.FRONTEND_LOCALHOST_URL],
    methods: Constants.API_METHODS,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  // Global Guard for all routes
  const reflector = new Reflector();
  app.useGlobalGuards(new AccessTokenGuard(reflector));

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));
  await app.listen(process.env.PORT);
}
bootstrap();
