import { FastifyInstance } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    hash(password: string): Promise<string>;
    hashCompare(hashedPassword: string, plainPassword: string): Promise<boolean>;
    authenticate(request: any, reply: any): Promise<void>;
    authenticateOptional(request: any, reply: any): Promise<void>;
    optionsEnv: {
      API_HOST: string;
      API_PORT: number;
      API_PREFIX: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
    };
  }
}
