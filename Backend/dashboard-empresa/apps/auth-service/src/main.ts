import * as dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3032, 
    },
  });

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Configuración Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Auth Service')
    .setDescription('API de autenticación de usuarios empresa')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();

  const port = process.env.AUTH_PORT || 3031;
  await app.listen(port);

  console.log(`Auth Service HTTP running on port ${port}`);
  console.log(`Auth Service TCP running on port 3032`);
  console.log(`Swagger UI: http://localhost:${port}/api`);
}

bootstrap();
