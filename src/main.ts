import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'body-parser';
import { AppModule } from './app.module';
import Constants from './utils/Constants';

export const API_VERSION = 'v1';
export const APP_PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`/api/${API_VERSION}`);
  app.enableCors({
    origin: [Constants.FRONTEND_LOCALHOST_URL],
    methods: Constants.API_METHODS,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));
  await app.listen(process.env.PORT);
}
bootstrap();
