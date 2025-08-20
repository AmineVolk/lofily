import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';

import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { RequestInterceptor } from './interceptor/request.interceptor';
import { validationPipeOptions } from './config/dto.config';

const NEEDED_FOLDERS = [
  './public/backgrounds',
  './public/effects',
  './public/thumbnail',
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  NEEDED_FOLDERS.forEach((folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
  });

  app.useGlobalPipes(
    new ValidationPipe({
      ...validationPipeOptions,
      exceptionFactory: (errors) => {
        logger.error('Validation errors:', errors);
        return new Error('Données de validation invalides');
      },
    }),
  );

  app.useGlobalInterceptors(new RequestInterceptor());
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  logger.log('listen on ', process.env.PORT);
  await app.listen(process.env.PORT);
}
bootstrap();
