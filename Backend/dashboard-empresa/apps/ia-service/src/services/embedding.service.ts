import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { createHash } from 'crypto';

@Injectable()
export class EmbeddingService {
  private readonly baseUrl = 'http://localhost:1234/v1';
  private readonly modelName = 'text-embedding-all-minilm-l6-v2-embedding';
  private readonly VECTOR_DIMENSION = 384;
  
  // Almacena embeddings ya generados para evitar reprocesamiento
  private embeddingCache = new Map<string, number[]>();

  // Genera embeddings para múltiples textos en una sola llamada HTTP
  async textToVectorBatch(texts: string[]): Promise<number[][]> {
    try {
      const uncachedIndices: number[] = [];
      const results: number[][] = new Array(texts.length);
      
      // Verificar cuáles textos ya están en caché
      texts.forEach((text, i) => {
        const hash = createHash('md5').update(text).digest('hex');
        if (this.embeddingCache.has(hash)) {
          results[i] = this.embeddingCache.get(hash)!;
        } else {
          uncachedIndices.push(i);
        }
      });
      
      if (uncachedIndices.length === 0) {
        console.log(`Todos los embeddings (${texts.length}) recuperados desde cache`);
        return results;
      }
      
      console.log(`Generando ${uncachedIndices.length} embeddings en lote (${texts.length - uncachedIndices.length} desde cache)`);
      
      const uncachedTexts = uncachedIndices.map(i => texts[i]);
      
      const response = await axios.post(
        `${this.baseUrl}/embeddings`,
        {
          model: this.modelName,
          input: uncachedTexts,
        },
        {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const embeddings = response.data.data.map((item: any) => item.embedding);
      
      // Guardar en caché y en resultados
      embeddings.forEach((embedding: number[], batchIndex: number) => {
        const originalIndex = uncachedIndices[batchIndex];
        const text = texts[originalIndex];
        const hash = createHash('md5').update(text).digest('hex');
        
        this.embeddingCache.set(hash, embedding);
        results[originalIndex] = embedding;
      });
      
      console.log(`Lote de ${uncachedIndices.length} embeddings generado correctamente`);

      return results;
    } catch (error) {
      console.warn('El procesamiento en lote fallo, procesando individualmente...', error.message);
      
      return Promise.all(texts.map(text => this.textToVector(text)));
    }
  }

  async textToVector(text: string): Promise<number[]> {
    try {
      const hash = createHash('md5').update(text).digest('hex');
      
      if (this.embeddingCache.has(hash)) {
        console.log(`Embedding recuperado desde cache (${text.substring(0, 30)}...)`);
        return this.embeddingCache.get(hash)!;
      }

      console.log(`Generando embedding para: "${text.substring(0, 50)}..."`);

      const response = await axios.post(
        `${this.baseUrl}/embeddings`,
        {
          model: this.modelName,
          input: text,
        },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const embedding = response.data.data[0].embedding;
      
      this.embeddingCache.set(hash, embedding);
      
      console.log(`Embedding generado correctamente (dimension: ${embedding.length})`);

      return embedding;
    } catch (error) {
      console.error('Error generando embedding:', error.message);
      
      if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
        throw new Error(
          'No se puede conectar con LM Studio para embeddings. ' +
          'Asegurate de que el modelo text-embedding-all-minilm-l6-v2 este cargado.'
        );
      }
      
      throw new Error(`Error al generar embedding: ${error.message}`);
    }
  }

  async calculateSimilarity(text1: string, text2: string): Promise<number> {
    const vector1 = await this.textToVector(text1);
    const vector2 = await this.textToVector(text2);

    return this.cosineSimilarity(vector1, vector2);
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  getInfo() {
    return {
      service: 'LM Studio Embedding Service',
      model: this.modelName,
      vectorDimension: this.VECTOR_DIMENSION,
      endpoint: `${this.baseUrl}/embeddings`,
      algorithm: 'all-MiniLM-L6-v2 via LM Studio',
      cacheSize: this.embeddingCache.size,
      cachingEnabled: true,
    };
  }
}
