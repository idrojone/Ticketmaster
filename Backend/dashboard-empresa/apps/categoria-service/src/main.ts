import { NestFactory } from '@nestjs/core';
import { CategoriaMerchandisingModule } from './categoria.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(CategoriaMerchandisingModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3070);
  console.log('🏷️  Categoria Service running on port 3070');
}
bootstrap();
