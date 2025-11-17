import { NestFactory } from '@nestjs/core';
import { CategoriaMerchandisingModule } from './categoria.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(CategoriaMerchandisingModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3035,
    },
  });

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Categoria Merchandising Service')
    .setDescription('API para la gestión de categorías de merchandising')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();

  const port = process.env.CATEGORIA_PORT || 3070;
  await app.listen(port);

  console.log(`Categoria Service HTTP running on port ${port}`);
  console.log(`Categoria Service TCP running on port 3035`);
  console.log(`Swagger UI: http://localhost:${port}/api`);
}
bootstrap();
