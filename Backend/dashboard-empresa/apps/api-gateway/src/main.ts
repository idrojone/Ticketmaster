import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  
  app.enableCors();
  
  const port = process.env.PORT || 3030;
  await app.listen(port);
  
  console.log(`🚀 API Gateway running on port ${port}`);
}

bootstrap();
