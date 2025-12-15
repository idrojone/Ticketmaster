import { NestFactory } from '@nestjs/core';
import { MerchServiceModule } from './merch-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(MerchServiceModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: process.env.MERCH_TCP_HOST || '0.0.0.0',
      port: parseInt(process.env.MERCH_TCP_PORT || '3034', 10),
    },
  });

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Merchandising Service')
    .setDescription('API para la gestión de merchandising')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();

  const port = process.env.MERCH_PORT || 3069;
  await app.listen(port, '0.0.0.0');

  console.log(`Merch Service HTTP running on port ${port}`);
  console.log(`Merch Service TCP running on port 3034`);
  console.log(`Swagger UI: http://localhost:${port}/api`);
}
bootstrap();
