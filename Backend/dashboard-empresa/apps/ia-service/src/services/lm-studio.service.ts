import { Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

@Injectable()
export class LmStudioService {
  // private readonly baseUrl = 'http://localhost:1234/v1';
  private readonly baseUrl = 'http://169.254.83.107:1234/v1';
  private readonly timeout = 60000; // 60 segundos

  async generateResponse(prompt: string, abortSignal?: AbortSignal): Promise<string> {
    try {
      console.log('Conectando con LM Studio...');

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'local-model',

          messages: [
            {
              role: 'system',
              content: 'Eres un asistente inteligente para un dashboard de gestión empresarial. Responde de manera concisa, profesional y útil.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],

          temperature: 0.7,

          max_tokens: 3000,

          top_p: 0.9,

          stream: false,
        },
        {
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/json',
          },
          signal: abortSignal,
        },
      );

      const generatedText = response.data.choices[0].message.content;

      console.log('Respuesta generada exitosamente');

      return generatedText;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/models`, {
        timeout: 5000,
      });

      const models = response.data.data || [];
      
      if (models.length === 0) {
        console.log('LM Studio esta corriendo pero no hay modelos cargados');
        return false;
      }

      console.log(`LM Studio disponible con ${models.length} modelo(s)`);
      return true;
    } catch (error) {
      console.log('LM Studio no esta disponible');
      return false;
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/models`, {
        timeout: 5000,
      });

      const models = response.data.data || [];
      return models.map((model: any) => model.id);
    } catch (error) {
      console.error('Error al listar modelos:', error.message);
      return [];
    }
  }

  async generateWithConfig(config: {
    prompt: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    systemMessage?: string;
  }): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'local-model',
          messages: [
            {
              role: 'system',
              content: config.systemMessage || 'Eres un asistente útil.',
            },
            {
              role: 'user',
              content: config.prompt,
            },
          ],
          temperature: config.temperature ?? 0.7,
          max_tokens: config.maxTokens ?? 3000,
          top_p: config.topP ?? 0.9,
          stream: false,
        },
        { timeout: this.timeout },
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.code === 'ECONNREFUSED') {
        throw new Error(
          'No se puede conectar con LM Studio. ' +
          'Asegúrate de que:\n' +
          '1. LM Studio esté instalado y corriendo\n' +
          '2. Tengas un modelo cargado\n' +
          '3. El servidor esté en http://localhost:1234'
        );
      }

      if (axiosError.code === 'ECONNABORTED') {
        throw new Error(
          'Timeout: LM Studio tardó demasiado en responder. ' +
          'Intenta con un prompt más corto o aumenta el timeout.'
        );
      }

      if (axiosError.response) {
        const status = axiosError.response.status;
        const data = axiosError.response.data as any;

        throw new Error(
          `Error de LM Studio (${status}): ${data.error?.message || 'Error desconocido'}`
        );
      }
    }

    throw new Error(
      `Error inesperado al comunicarse con LM Studio: ${error.message}`
    );
  }

  getInfo() {
    return {
      service: 'LM Studio Service',
      endpoint: this.baseUrl,
      timeout: `${this.timeout / 1000}s`,
      status: 'Para verificar conexión, usa healthCheck()',
    };
  }
}
