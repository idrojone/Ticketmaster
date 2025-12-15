import { NestFactory } from '@nestjs/core';
import { IaModule } from './ia.module';

async function bootstrap() {
  const app = await NestFactory.create(IaModule);
  
  app.enableCors({
    origin: 'http://localhost:4200', 
    credentials: true,
  });
  
  const port = 3079;
  await app.listen(port);
  
  console.log(`Servidor corriendo en: http://localhost:${port}`);
  console.log(`Rutas disponibles:`);
  console.log(`POST http://localhost:${port}/ia/chat`);
  console.log(`GET  http://localhost:${port}/ia/health`);
}

bootstrap();
