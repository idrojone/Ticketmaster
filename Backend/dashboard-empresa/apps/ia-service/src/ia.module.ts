import { Module } from '@nestjs/common';
import { IaController } from './ia.controller';
import { IaService } from './ia.service';
import { RagService } from './services/rag.service';
import { EmbeddingService } from './services/embedding.service';
import { VectorDbService } from './services/vector-db.service';
import { LmStudioService } from './services/lm-studio.service';

@Module({
  imports: [],
  controllers: [IaController],
  providers: [
    IaService,         // Orquestador principal
    RagService,        // Coordina búsqueda de contexto
    EmbeddingService,  // Convierte texto → vectores
    VectorDbService,   // Base de datos vectorial
    LmStudioService,   // Comunicación con IA local
  ],
  exports: [IaService],
})
export class IaModule {}
