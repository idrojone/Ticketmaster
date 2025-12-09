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

      // Genera el embedding del texto
      const vector = await this.embeddingService.textToVector(text);

      // Guarda en la base de datos vectorial
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

  async indexMultipleDocuments(
    documents: Array<{ id: string; text: string; metadata?: any }>,
  ): Promise<void> {
    console.log(`Indexando ${documents.length} documentos...`);

    for (const doc of documents) {
      await this.indexDocument(doc.id, doc.text, doc.metadata);
    }

    console.log(`${documents.length} documentos indexados`);
  }

  private async indexInitialDocuments(): Promise<void> {
    const documents = [
      {
        "_id": {
          "$oid": "6931d3f538c5eaedf484fe62"
        },
        "slug": "metallica-world-tour-2025",
        "nombre": "Metallica World Tour 2025",
        "fecha": {
          "$date": "2026-01-11T00:00:00.000Z"
        },
      "artista": "Metallica",
      "lugar": "Wanda Metropolitano",
      "ciudad": "Madrid",
      "descripcion": "El Wanda Metropolitano es el estadio oficial del Club Atlético de Madrid desde 2017. Con una capacidad de 68,456 espectadores, es uno de los recintos deportivos más modernos de Europa. Su diseño vanguardista y su excelente acústica lo convierten en el escenario perfecto para los grandes eventos musicales.",
      "latitud": 40.43611,
      "longitud": -3.599722,
      "precio": 85,
      "aforo": {
        "$numberLong": "68000"
      },
      "duracion": {
        "$numberLong": "1"
      },
      "imagenArtista": "https://i.scdn.co/image/ab6761610000517469ca98dd3083f1082d740e44",
      "imagenesShow": [],
      "id_genero": "rock",
      "merchandisingId": {
        "$oid": "6930767506e94485b040a3df"
      },
      "status": "ACCEPTED",
      "is_active": true,
      "createdAt": {
        "$date": "2025-12-04T18:33:25.778Z"
      },
      "updatedAt": {
        "$date": "2025-12-04T18:33:25.778Z"
      }
    },
    {
      "_id": {
        "$oid": "6931e1cd38c5eaedf484fe63"
      },
      "slug": "thunder-tour",
      "nombre": "Thunder Tour",
      "fecha": {
        "$date": "2026-01-11T00:00:00.000Z"
      },
      "artista": "AC/DC",
      "lugar": "Estadio Santiago Bernabéu",
      "ciudad": "Madrid",
      "descripcion": "AC/DC regresa con su legendario show lleno de energía. Thunderstruck y todos sus hits en vivo.",
      "latitud": 40.453054,
      "longitud": -3.688344,
      "precio": 85,
      "aforo": {
        "$numberLong": "81000"
      },
      "duracion": {
        "$numberLong": "1"
      },
      "imagenArtista": "https://i.scdn.co/image/ab67616100005174c4c77549095c86acb4e77b37",
      "imagenesShow": [],
      "id_genero": "rock",
      "merchandisingId": {
        "$oid": "6930761c06e94485b040a3de"
      },
      "status": "ACCEPTED",
      "is_active": true,
      "createdAt": {
        "$date": "2025-12-04T19:32:29.521Z"
      },
      "updatedAt": {
        "$date": "2025-12-04T19:37:32.488Z"
      }
    },
    {
      "_id": {
        "$oid": "6931e22138c5eaedf484fe64"
      },
      "slug": "taylor-swift-eras-tour",
      "nombre": "Taylor Swift Eras Tour",
      "fecha": {
        "$date": "2026-01-11T00:00:00.000Z"
      },
      "artista": "Taylor Swift",
      "lugar": "Camp Nou",
      "ciudad": "Barcelona",
      "descripcion": "Taylor Swift presenta todos sus éxitos en un espectáculo visual impresionante que recorre todas sus eras musicales.",
      "latitud": 41.380896,
      "longitud": 2.12282,
      "precio": 120,
      "aforo": {
        "$numberLong": "99000"
      },
      "duracion": {
        "$numberLong": "1"
      },
      "imagenArtista": "https://i.scdn.co/image/ab67616100005174e2e8e7ff002a4afda1c7147e",
      "imagenesShow": [],
      "id_genero": "pop",
      "merchandisingId": {
        "$oid": "6930761c06e94485b040a3de"
      },
      "status": "ACCEPTED",
      "is_active": true,
      "createdAt": {
        "$date": "2025-12-04T19:33:53.420Z"
      },
      "updatedAt": {
        "$date": "2025-12-04T19:33:53.420Z"
      }
    },
    {
      "_id": {
        "$oid": "6931e28f38c5eaedf484fe65"
      },
      "slug": "future-nostalgia-tour",
      "nombre": "Future Nostalgia Tour",
      "fecha": {
        "$date": "2026-02-22T00:00:00.000Z"
      },
      "artista": "Dua Lipa",
      "lugar": "WiZink Center",
      "ciudad": "Madrid",
      "descripcion": "Dua Lipa presenta su álbum Future Nostalgia con un show lleno de baile y energía pop.",
      "latitud": 40.422056,
      "longitud": -3.670139,
      "precio": 75,
      "aforo": {
        "$numberLong": "170000"
      },
      "duracion": {
        "$numberLong": "1"
      },
      "imagenArtista": "https://i.scdn.co/image/ab676161000051740c68f6c95232e716f0abee8d",
      "imagenesShow": [],
      "id_genero": "pop",
      "merchandisingId": {
        "$oid": "6930773d06e94485b040a3e0"
      },
      "status": "ACCEPTED",
      "is_active": true,
      "createdAt": {
        "$date": "2025-12-04T19:35:43.096Z"
      },
      "updatedAt": {
        "$date": "2025-12-04T19:35:43.096Z"
      }
    },
    {
      "_id": {
        "$oid": "6931e2ed38c5eaedf484fe66"
      },
      "slug": "big-steppers-tour",
      "nombre": "Big Steppers Tour",
      "fecha": {
        "$date": "2026-04-30T00:00:00.000Z"
      },
      "artista": "Kendrick Lamar",
      "lugar": "Palau de Esports",
      "ciudad": "Barcelona",
      "descripcion": "Kendrick Lamar presenta su aclamado álbum con un show íntimo lleno de liricas profundas y beats innovadores.",
      "latitud": 41.348056,
      "longitud": 2.1525,
      "precio": 90,
      "aforo": {
        "$numberLong": "12500"
      },
      "duracion": {
        "$numberLong": "1"
      },
      "imagenArtista": "https://i.scdn.co/image/ab6761610000517439ba6dcd4355c03de0b50918",
      "imagenesShow": [],
      "id_genero": "hip-hop",
      "merchandisingId": {
        "$oid": "6930773d06e94485b040a3e0"
      },
      "status": "ACCEPTED",
      "is_active": true,
      "createdAt": {
        "$date": "2025-12-04T19:37:17.951Z"
      },
      "updatedAt": {
        "$date": "2025-12-04T19:37:17.951Z"
      }
    },
    {
      "_id": {
        "$oid": "6931e3ae38c5eaedf484fe67"
      },
      "slug": "its-all-a-blur-tour",
      "nombre": "It's All A Blur Tour",
      "fecha": {
        "$date": "2026-08-01T00:00:00.000Z"
      },
      "artista": "Drake",
      "lugar": "Estadio La Cartuja",
      "ciudad": "Sevilla",
      "descripcion": "Drake trae sus mayores éxitos en un espectáculo que combina rap, R&B y producción de clase mundial.",
      "latitud": 37.413889,
      "longitud": -5.978056,
      "precio": 110,
      "aforo": {
        "$numberLong": "60000"
      },
      "duracion": {
        "$numberLong": "1"
      },
      "imagenArtista": "https://i.scdn.co/image/ab676161000051744293385d324db8558179afd9",
      "imagenesShow": [],
      "id_genero": "hip-hop",
      "merchandisingId": {
        "$oid": "6930773d06e94485b040a3e0"
      },
      "status": "ACCEPTED",
      "is_active": true,
      "createdAt": {
        "$date": "2025-12-04T19:40:30.446Z"
      },
      "updatedAt": {
        "$date": "2025-12-04T19:40:30.446Z"
      }
    },
    {
      "_id": {
        "$oid": "6931e42e38c5eaedf484fe68"
      },
      "slug": "live-nation",
      "nombre": "Live Nation",
      "fecha": {
        "$date": "2026-07-30T00:00:00.000Z"
      },
      "artista": "Calvin Harris",
      "lugar": "Cala Mijas",
      "ciudad": "Málaga",
      "descripcion": "Calvin Harris presenta un set único con sus hits más bailables en un ambiente de festival electrónico.",
      "latitud": 36.5897,
      "longitud": -4.6381,
      "precio": 65,
      "aforo": {
        "$numberLong": "25000"
      },
      "duracion": {
        "$numberLong": "1"
      },
      "imagenArtista": "https://i.scdn.co/image/ab676161000051741e4bcd2bef1896648762dd6b",
      "imagenesShow": [],
      "id_genero": "electronic",
      "merchandisingId": {
        "$oid": "6930761c06e94485b040a3de"
      },
      "status": "ACCEPTED",
      "is_active": true,
      "createdAt": {
        "$date": "2025-12-04T19:42:38.560Z"
      },
      "updatedAt": {
        "$date": "2025-12-04T19:42:38.560Z"
      }
    }
    ];

    // Transformar documentos MongoDB al formato esperado por el vector database
    const transformedDocuments = documents.map(doc => ({
      id: doc._id.$oid,
      text: `Concierto: ${doc.nombre}. Artista: ${doc.artista}. Lugar: ${doc.lugar}, ${doc.ciudad}. Fecha: ${doc.fecha.$date}. Descripción: ${doc.descripcion}. Género: ${doc.id_genero}. Precio: ${doc.precio}€. Aforo: ${doc.aforo.$numberLong} personas. Duración: ${doc.duracion.$numberLong} minutos. Coordenadas: ${doc.latitud}, ${doc.longitud}. Imagen del artista: ${doc.imagenArtista}.`,
      metadata: {
        slug: doc.slug,
        nombre: doc.nombre,
        fecha: doc.fecha.$date,
        artista: doc.artista,
        lugar: doc.lugar,
        ciudad: doc.ciudad,
        descripcion: doc.descripcion,
        precio: doc.precio,
        aforo: parseInt(doc.aforo.$numberLong),
        duracion: parseInt(doc.duracion.$numberLong),
        genero: doc.id_genero,
        latitud: doc.latitud,
        longitud: doc.longitud,
        imagenArtista: doc.imagenArtista,
        imagenesShow: doc.imagenesShow,
      }
    }));

    await this.indexMultipleDocuments(transformedDocuments);
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
