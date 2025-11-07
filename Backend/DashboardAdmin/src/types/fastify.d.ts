import { FastifyInstance } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    hash(password: string): Promise<string>;
    hashCompare(hashedPassword: string, plainPassword: string): Promise<boolean>;
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    authenticateOptional(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    authenticateRole(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    generateAccessToken(username: string, reply: FastifyReply): Promise<string>;
  // Lanza un error y no retorna (sirve para signalizar errores HTTP desde plugins/modelos)
  throwError(statusCode: number, message: string): never;
    generateSlug(title: string): string;
    spotify: any;
    optionsEnv: {
      API_HOST: string;
      API_PORT: number;
      API_PREFIX: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      SPOTIFY_CLIENT_ID: string;
      SPOTIFY_CLIENT_SECRET: string;
    };
  }
}
