import { Injectable, OnModuleInit } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';
import { VectorDbService } from './vector-db.service';

@Injectable()
export class RagService implements OnModuleInit {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly vectorDbService: VectorDbService,
  ) {}

  async onModuleInit() {
    console.log('Inicializando RAG Service...');
    await this.indexInitialDocuments();
    console.log('RAG Service listo\n');
  }

  async getRelevantContext(userQuery: string, topK = 3): Promise<string> {
    try {
      console.log(`Query: "${userQuery}"`);

      const queryVector = await this.embeddingService.textToVector(userQuery);
      const results = await this.vectorDbService.searchSimilar(queryVector, topK);

      if (results.length === 0) {
        console.log('No se encontraron documentos relevantes');
        return '';
      }

      const MIN_SIMILARITY = 0.3;
      const relevantDocs = results.filter(r => r.similarity > MIN_SIMILARITY);

      if (relevantDocs.length === 0) {
        console.log('Los documentos encontrados tienen baja similitud');
        return '';
      }

      const context = relevantDocs
        .map((result, index) => {
          const percentage = (result.similarity * 100).toFixed(0);
          return `[Fuente ${index + 1} - Relevancia: ${percentage}%]\n${result.document.text}`;
        })
        .join('\n\n');

      console.log(`Contexto generado con ${relevantDocs.length} documentos\n`);

      return context;
    } catch (error) {
      console.error('Error en RAG Service:', error.message);
      return '';
    }
  }

  async indexDocument(
    id: string,
    text: string,
    metadata?: any,
  ): Promise<void> {
    try {
      console.log(`Indexando documento: ${id}`);

      const vector = await this.embeddingService.textToVector(text);

      await this.vectorDbService.saveDocument({
        id,
        text,
        vector,
        metadata,
      });

      console.log(`Documento indexado: ${id}`);
    } catch (error) {
      console.error(`Error al indexar documento ${id}:`, error.message);
      throw error;
    }
  }

  async indexMultipleDocuments(documents) {
    console.log(`Indexando ${documents.length} documentos con procesamiento en lote...`);
    
    const texts = documents.map(d => d.text);
    
    // Genera todos los embeddings en una sola petición
    const embeddings = await this.embeddingService.textToVectorBatch(texts);
    
    // Guarda todos los documentos en paralelo
    await Promise.all(
      documents.map((doc, i) => 
        this.vectorDbService.saveDocument({
          id: doc.id,
          text: doc.text,
          vector: embeddings[i],
          metadata: doc.metadata,
        })
      )
    );
    
    console.log(`${documents.length} documentos indexados correctamente`);
  }

  private async indexInitialDocuments(): Promise<void> {
    console.log('Obteniendo documentos iniciales desde VectorDB...');
    
    const documentsToIndex = await this.vectorDbService.getInitialDocumentsForIndexing();
    
    console.log(`Recibidos ${documentsToIndex.length} documentos para indexar`);
    
    // Indexa cada documento generando sus vectores
    await this.indexMultipleDocuments(documentsToIndex);
  }

  async getStats() {
    const dbStats = await this.vectorDbService.getStats();
    const embeddingInfo = this.embeddingService.getInfo();

    return {
      rag: {
        service: 'RAG Service',
        status: 'active',
      },
      vectorDatabase: dbStats,
      embeddings: embeddingInfo,
    };
  }
}
