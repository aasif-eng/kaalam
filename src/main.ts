// src/main.ts

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix — all routes become /api/v1/...
  app.setGlobalPrefix('api/v1');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown fields
      forbidNonWhitelisted: true, // throw on unknown fields
      transform: true, // auto-transform types (e.g. string -> number)
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global exception filter — unified error shape
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS — adjust origins in production
  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(
    `\n🎮 Game Purchases API running on http://localhost:${port}/api/v1`,
  );
  console.log(`   POST   /api/v1/transactions         — buy a level`);
  console.log(
    `   GET    /api/v1/transactions?device_id=<id>  — get purchases\n`,
  );
}
void bootstrap();
