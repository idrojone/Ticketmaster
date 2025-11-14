import { NestFactory } from '@nestjs/core';
import { MerchServiceModule } from './merch-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   MerchServiceModule,
  //   {
  //     transport: Transport.TCP,
  //   }
  // );
  // await app.listen();

  const app = await NestFactory.create(MerchServiceModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Merchandising Service')
    .setDescription('API para la gestión de merchandising')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3069);
  console.log('Microservice is listening on port 3069');
}
bootstrap();
