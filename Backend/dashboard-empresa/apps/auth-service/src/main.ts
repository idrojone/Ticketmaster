import * as dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.AUTH_PORT || 3031;
  await app.listen(port);

  console.log(`Auth Service running on port ${port}`);
}

bootstrap();
