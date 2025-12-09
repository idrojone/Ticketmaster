import { Injectable, OnModuleInit } from '@nestjs/common';

export interface VectorDocument {
  id: string;
  text: string;
  vector: number[];
  metadata?: {
    source?: string;      
    date?: string;        
    category?: string;    
    [key: string]: any;   
  };
}

export interface SearchResult {
  document: VectorDocument;
  similarity: number;  
}

@Injectable()
export class VectorDbService implements OnModuleInit {
  private documents: VectorDocument[] = [];

  async onModuleInit() {
    console.log('Inicializando Vector Database...');
    await this.seedInitialData();
    console.log(` Vector Database lista con ${this.documents.length} documentos\n`);
  }

  async saveDocument(doc: VectorDocument): Promise<void> {
    // Verifica que el vector tenga valores
    if (!doc.vector || doc.vector.length === 0) {
      throw new Error('El documento debe tener un vector válido');
    }

    // Busca si ya existe un documento con el mismo ID
    const existingIndex = this.documents.findIndex(d => d.id === doc.id);

    if (existingIndex >= 0) {
      // Actualiza el documento existente
      this.documents[existingIndex] = doc;
      console.log(`   ♻️  Documento actualizado: ${doc.id}`);
    } else {
      // Agrega nuevo documento
      this.documents.push(doc);
      console.log(`   ✅ Documento guardado: ${doc.id}`);
    }
  }

  async searchSimilar(queryVector: number[], topK = 3): Promise<SearchResult[]> {
    if (this.documents.length === 0) {
      console.log('   ⚠️  No hay documentos en la base de datos');
      return [];
    }

    console.log(`   🔍 Buscando top ${topK} documentos similares...`);

    // Calcula la similitud con cada documento
    const results: SearchResult[] = this.documents.map(doc => ({
      document: doc,
      similarity: this.cosineSimilarity(queryVector, doc.vector),
    }));

    // Ordena por similitud (mayor primero)
    results.sort((a, b) => b.similarity - a.similarity);

    // Devuelve solo los top K
    const topResults = results.slice(0, topK);

    // Log de resultados
    topResults.forEach((result, index) => {
      const percentage = (result.similarity * 100).toFixed(1);
      console.log(`   ${index + 1}. [${percentage}%] ${result.document.text.substring(0, 60)}...`);
    });

    return topResults;
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

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    
    // Evita división por cero
    if (denominator === 0) {
      return 0;
    }

    return dotProduct / denominator;
  }

  async getStats() {
    const categories = new Set(
      this.documents
        .map(d => d.metadata?.category)
        .filter(c => c)
    );

    return {
      totalDocuments: this.documents.length,
      categories: Array.from(categories),
      vectorDimension: this.documents[0]?.vector.length || 0,
    };
  }

  async clear(): Promise<void> {
    this.documents = [];
    console.log('Base de datos vectorial limpiada');
  }


  private async seedInitialData(): Promise<void> {
    
    const initialDocuments = [
      {
        id: 'doc-1',
        text: 'Este mes se vendieron 450 tickets para conciertos de rock.',
        metadata: { category: 'ventas', source: 'sistema', date: '2024-12-09' },
      },
      {
        id: 'doc-2',
        text: 'El evento más popular fue el concierto de The Rolling Stones con 200 entradas vendidas.',
        metadata: { category: 'eventos', source: 'sistema', date: '2024-12-05' },
      },
      {
        id: 'doc-3',
        text: 'Taylor Swift tuvo un 95% de ocupación con 180 tickets vendidos.',
        metadata: { category: 'eventos', source: 'sistema', date: '2024-12-03' },
      },
      {
        id: 'doc-4',
        text: 'Los eventos de indie vendieron 70 tickets este mes.',
        metadata: { category: 'ventas', source: 'sistema', date: '2024-12-08' },
      },
      {
        id: 'doc-5',
        text: 'El total de ingresos este mes es de 25,000 euros.',
        metadata: { category: 'finanzas', source: 'contabilidad', date: '2024-12-09' },
      },
      {
        id: 'doc-6',
        text: 'Arctic Monkeys está programado para el 15 de diciembre.',
        metadata: { category: 'eventos', source: 'calendario', date: '2024-12-01' },
      },
      {
        id: 'doc-7',
        text: 'El género rock representa el 60% de las ventas totales.',
        metadata: { category: 'estadísticas', source: 'analytics', date: '2024-12-09' },
      },
      {
        id: 'doc-8',
        text: 'Hay 3 eventos confirmados para la próxima semana.',
        metadata: { category: 'calendario', source: 'sistema', date: '2024-12-09' },
      },
    ];
    

    console.log(`Documentos base preparados: ${initialDocuments.length}`);
    
    // Guarda temporalmente sin vectores (se agregarán después)
    // En un flujo real, el RAG Service llamará a indexDocument()
  }

  /**
   * 📄 OBTIENE TODOS LOS DOCUMENTOS
   * (Útil para debugging)
   */
  async getAllDocuments(): Promise<VectorDocument[]> {
    return this.documents;
  }
}
