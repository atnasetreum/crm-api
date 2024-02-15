import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: `${process.env.WHITE_LIST_DOMAINS}`.split(','),
      credentials: true,
    },
  });

  app.setGlobalPrefix('/api/v1');

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const PORT = process.env.PORT;
  const NODE_ENV = process.env.NODE_ENV;

  await app.listen(PORT);

  console.log(
    `**************   [API] Running on port: [${PORT}], environment: [${NODE_ENV}]   **************`,
  );
}
bootstrap();
