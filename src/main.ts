import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT;
  const NODE_ENV = process.env.NODE_ENV;

  await app.listen(PORT);

  console.log(
    `**************   [API] Running on port: [${PORT}], environment: [${NODE_ENV}]   **************`,
  );
}
bootstrap();
