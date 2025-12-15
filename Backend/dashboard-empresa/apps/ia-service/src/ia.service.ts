import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { RagService } from './services/rag.service';
import { LmStudioService } from './services/lm-studio.service';

@Injectable()
export class IaService {
  // Controlador para cancelar peticiones anteriores
  private currentAbortController: AbortController | null = null;
  private isProcessing = false;

  constructor(
    private readonly ragService: RagService,
    private readonly lmStudioService: LmStudioService,
  ) {}

  async processMessage(userMessage: string): Promise<any> {
    if (!userMessage || userMessage.trim() === '') {
      throw new BadRequestException('El campo "message" es requerido y no puede estar vacío');
    }

    if (this.isProcessing && this.currentAbortController) {
      console.log('⚠️ Nueva petición recibida. Cancelando petición anterior...');
      this.currentAbortController.abort();
      this.currentAbortController = null;
    }

    this.currentAbortController = new AbortController();
    this.isProcessing = true;
    const currentController = this.currentAbortController;

    try {
      console.log(`Nueva pregunta recibida: "${userMessage}"`);

      console.log('Buscando contexto relevante...');

      //Cambiar si queremos el contexto mas relevante
      const context = await this.ragService.getRelevantContext(userMessage, 100);
      
      // Verificar si fue cancelado
      if (currentController.signal.aborted) {
        console.log('Petición cancelada durante búsqueda de contexto');
        throw new Error('Request cancelled: nueva petición recibida');
      }
      
      if (!context || context.trim() === '') {
        console.log('No se encontró contexto relevante');
      } else {
        console.log('Contexto encontrado');
      }
      
      console.log('PASO 2: Construyendo prompt...');
      const prompt = this.buildPrompt(userMessage, context);
      console.log('Prompt construido');

      console.log('PASO 3: Generando respuesta con IA...');
      const response = await this.lmStudioService.generateResponse(prompt, currentController.signal);
      
      // Verificar si fue cancelado
      if (currentController.signal.aborted) {
        console.log('Petición cancelada durante generación IA');
        throw new Error('Request cancelled: nueva petición recibida');
      }

      console.log('Respuesta generada exitosamente');

      // Parsear la respuesta JSON si es un string
      let parsedResponse;
      try {
        parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
      } catch (parseError) {
        console.warn('No se pudo parsear la respuesta como JSON, devolviendo como string:', parseError.message);
        parsedResponse = response;
      }

      return {
        success: true,
        message: userMessage,
        response: parsedResponse,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      // Si fue cancelado, no loguear como error
      if (error.message?.includes('Request cancelled') || error.name === 'AbortError' || error.name === 'CanceledError') {
        console.log('Petición anterior cancelada correctamente');
        throw new BadRequestException('Petición cancelada por nueva solicitud');
      }

      console.error('Error en IaService:', error.message);
      
      // Manejo de errores específicos
      if (error.message.includes('LM Studio')) {
        throw new InternalServerErrorException(
          'LM Studio no está disponible. ' +
          'Asegúrate de que esté corriendo en http://localhost:1234'
        );
      }
      
      throw new InternalServerErrorException(`Error al procesar tu mensaje: ${error.message}`);
    } finally {
      // Limpiar el estado
      if (currentController === this.currentAbortController) {
        this.isProcessing = false;
        this.currentAbortController = null;
      }
    }
  }

  private buildPrompt(message: string, context: string): string {
    
    const contextSection = context && context.trim() !== ''
      ? `Conciertos disponibles:\n${context}`
      : 'No se encontraron conciertos que coincidan con la busqueda.';

    return `
    Eres un asistente especializado en busqueda de conciertos. Tu objetivo es interpretar correctamente las solicitudes del usuario y devolver EXACTAMENTE lo que pide.

    ${contextSection}

    Consulta del usuario:
    ${message}

    INSTRUCCIONES CRITICAS - DEBES SEGUIRLAS ESTRICTAMENTE:

    1. INTERPRETACION DE LA CONSULTA (FILTROS Y ORDENAMIENTO):
    
       PRECIO:
       - "mas barato/economico/barata/economica" = Ordena por precio ASCENDENTE, devuelve el/los primero(s)
       - "mas caro/costoso/cara/costosa" = Ordena por precio DESCENDENTE, devuelve el/los primero(s)
       - "precio menor a X" / "menos de X euros" = Filtra solo conciertos con precio < X
       - "precio mayor a X" / "mas de X euros" = Filtra solo conciertos con precio > X
       
       FECHA:
       - "proximo/proximos/cercano/mas cercano" = Ordena por fecha mas CERCANA a hoy
       - "lejano/mas lejano/futuro" = Ordena por fecha mas LEJANA
       - "en enero/febrero/etc" = Filtra por mes especifico
       - "en 2026" = Filtra por año especifico
       
       CIUDAD:
       - "en Madrid/Barcelona/Sevilla/Malaga" = Filtra SOLO conciertos en esa ciudad
       - "cerca de Madrid" = Prioriza Madrid pero puede incluir otras ciudades cercanas
       - "fuera de Madrid" = Excluye Madrid
       
       GENERO:
       - "de rock/pop/hip-hop/electronic" = Filtra SOLO conciertos de ese genero
       - "que no sea rock" = Excluye ese genero
       
       ARTISTA:
       - "de Metallica/Taylor Swift/etc" = Filtra SOLO conciertos de ese artista
       - "parecido a Metallica" = Busca artistas del mismo genero
       
       AFORO/CAPACIDAD:
       - "mayor aforo/mas grande/mas capacidad" = Ordena por aforo DESCENDENTE
       - "menor aforo/mas intimo/mas pequeño" = Ordena por aforo ASCENDENTE
       - "con mas de X personas" = Filtra por aforo > X
       
       LUGAR/ESTADIO:
       - "en el Wanda/Bernabeu/Camp Nou/etc" = Filtra por lugar especifico
       - "en estadio/arena/pabellon" = Filtra por tipo de recinto

    2. ORDENAMIENTO Y CANTIDAD:
       - Singular ("LA mas barata", "EL mas caro") = Devuelve SOLO 1 concierto
       - Plural ("LAS mas baratas", "LOS 3 mas caros") = Devuelve 2-3 conciertos (o el numero especificado)
       - "todos" / "que conciertos hay" = Devuelve TODOS los disponibles
       - SIEMPRE ordena segun el criterio especifico del usuario ANTES de limitar cantidad

    3. COMBINACION DE FILTROS:
       Cuando el usuario combine multiples criterios, aplicalos TODOS:
       - "el concierto mas barato de rock" = Filtra por rock, luego ordena por precio, devuelve 1
       - "conciertos en Madrid ordenados por precio" = Filtra por Madrid, ordena por precio
       - "los 2 proximos conciertos de pop" = Filtra por pop, ordena por fecha, devuelve 2

    4. FORMATO DE RESPUESTA:
       Devuelve UNICAMENTE un JSON valido con esta estructura:
       {
         "conciertos": [
           {
             "slug": "string",
             "nombre": "string",
             "fecha": "ISO date string",
             "artista": "string",
             "lugar": "string",
             "ciudad": "string",
             "descripcion": "string",
             "precio": number,
             "aforo": number,
             "duracion": number,
             "imagenArtista": "string (URL)",
             "id_genero": "string",
             "latitud": number,
             "longitud": number,
             "imagenesShow": []
           }
         ],
         "mensaje": "Explicacion breve y clara de que criterios aplicaste y por que"
       }

    5. REGLAS ESTRICTAS:
       - NO inventes datos que no esten en los conciertos disponibles arriba
       - NO añadas texto explicativo fuera del JSON
       - NO devuelvas conciertos que no cumplan TODOS los filtros del usuario
       - SI el usuario especifica un orden, RESPETALO SIEMPRE
       - El campo "mensaje" debe ser descriptivo y mencionar los criterios aplicados
       - Si no hay conciertos que cumplan los criterios: {"conciertos": [], "mensaje": "No se encontraron conciertos con esos criterios"}

    EJEMPLOS CORRECTOS:
    
    Usuario: "dame la entrada mas barata"
    Respuesta: {"conciertos": [<Calvin Harris 65 euros>], "mensaje": "Entrada mas economica encontrada: 65 euros - Calvin Harris"}

    Usuario: "conciertos de rock en Madrid"
    Respuesta: {"conciertos": [<Metallica y AC/DC>], "mensaje": "2 conciertos de rock en Madrid"}

    Usuario: "el concierto mas cercano"
    Respuesta: {"conciertos": [<el de fecha mas proxima>], "mensaje": "Proximo concierto: [fecha]"}

    Usuario: "los 3 conciertos mas caros"
    Respuesta: {"conciertos": [<Taylor 120, Drake 110, Kendrick 90>], "mensaje": "Top 3 conciertos ordenados por precio"}

    Usuario: "conciertos en Barcelona mas baratos"
    Respuesta: {"conciertos": [<conciertos de Barcelona ordenados por precio>], "mensaje": "Conciertos en Barcelona ordenados por precio"}

    Ahora responde a la consulta del usuario con SOLO el JSON (sin markdown ni explicaciones adicionales):`;
  }

  async checkLmStudioConnection(): Promise<boolean> {
    try {
      return await this.lmStudioService.healthCheck();
    } catch {
      return false;
    }
  }

  async healthCheck() {
    try {
      const lmStudioStatus = await this.checkLmStudioConnection();

      return {
        status: 'ok',
        service: 'IA Service',
        timestamp: new Date().toISOString(),
        lmStudio: lmStudioStatus ? 'connected' : 'disconnected',
        message: lmStudioStatus
          ? 'Servicio funcionando correctamente'
          : 'Servicio activo pero LM Studio no está disponible',
      };
    } catch (error) {
      return {
        status: 'error',
        service: 'IA Service',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }
}
