import { NestFactory } from '@nestjs/core';
import { MerchServiceModule } from './merch-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

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

  await app.listen(3069);
  console.log('Microservice is listening on port 3069');
}
bootstrap();
