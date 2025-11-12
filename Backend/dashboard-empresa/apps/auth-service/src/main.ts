import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  
  app.enableCors();
  
  const port = process.env.PORT || 3031;
  await app.listen(port);
  
  console.log(`🔐 Auth Service running on port ${port}`);
}

bootstrap();
