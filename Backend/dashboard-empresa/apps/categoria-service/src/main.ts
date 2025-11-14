import { NestFactory } from '@nestjs/core';
import { CategoriaMerchandisingModule } from './categoria.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(CategoriaMerchandisingModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Categoria Merchandising Service')
    .setDescription('API para la gestión de categorías de merchandising')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3070);
  console.log('Microservice is listening on port 3070');
}
bootstrap();
