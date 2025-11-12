import { NestFactory } from '@nestjs/core';
import { MerchandiseModule } from './merchandise.module';

async function bootstrap() {
  const app = await NestFactory.create(MerchandiseModule);
  
  app.enableCors();
  
  const port = process.env.PORT || 3032;
  await app.listen(port);
  
  console.log(`🛍️  Merchandise Service running on port ${port}`);
}

bootstrap();
