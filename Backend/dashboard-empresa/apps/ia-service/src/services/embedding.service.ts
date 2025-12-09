import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EmbeddingService {
  private readonly baseUrl = 'http://localhost:1234/v1';
  private readonly modelName = 'text-embedding-all-minilm-l6-v2-embedding';
  private readonly VECTOR_DIMENSION = 384; // Dimensión de all-MiniLM-L6-v2

  async textToVector(text: string): Promise<number[]> {
    try {
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
      
      console.log(`✅ Embedding generado (dimensión: ${embedding.length})`);

      return embedding;
    } catch (error) {
      console.error('❌ Error generando embedding:', error.message);
      
      if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
        throw new Error(
          'No se puede conectar con LM Studio para embeddings. ' +
          'Asegúrate de que el modelo text-embedding-all-minilm-l6-v2 esté cargado.'
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

    // Evita división por cero
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
    };
  }
}
