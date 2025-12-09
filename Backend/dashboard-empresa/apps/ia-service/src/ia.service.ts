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
      const context = await this.ragService.getRelevantContext(userMessage);
      
      // Verificar si fue cancelado
      if (currentController.signal.aborted) {
        console.log('❌ Petición cancelada durante búsqueda de contexto');
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
        console.log('❌ Petición cancelada durante generación IA');
        throw new Error('Request cancelled: nueva petición recibida');
      }

      console.log('✅ Respuesta generada exitosamente');

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
        console.log('🔄 Petición anterior cancelada correctamente');
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
      : 'No se encontraron conciertos que coincidan con la búsqueda.';

    return `
    Eres un asistente inteligente especializado en búsqueda de conciertos usando lenguaje natural.

    ${contextSection}

    Consulta del usuario:
    ${message}

    Instrucciones importantes:
    - Analiza la consulta del usuario para entender qué concierto está buscando (artista, género, ciudad, fecha, precio, etc.)
    - Si hay conciertos relevantes arriba, responde ÚNICAMENTE con un JSON válido que contenga un array de conciertos
    - Si no hay información relevante, responde con un JSON vacío: {"conciertos": [], "mensaje": "No se encontraron conciertos"}
    - Cada concierto debe tener EXACTAMENTE esta estructura:
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
    - NO añadas texto explicativo, SOLO el JSON
    - Si el usuario pregunta por información general (ej: "¿qué conciertos hay?"), devuelve todos los conciertos disponibles
    - Ordena los resultados por relevancia según la consulta del usuario

    Formato de respuesta (JSON válido):
    {
      "conciertos": [...array de conciertos...],
      "mensaje": "Descripción breve de los resultados"
    }

    Respuesta (SOLO JSON):`;
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
          ? '✅ Servicio funcionando correctamente'
          : '⚠️ Servicio activo pero LM Studio no está disponible',
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
