import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';

export default fp(async (fastify: FastifyInstance) => {
    fastify.decorate('throwError', (statusCode: number, message: string, details?: any): never => {
        const err: any = new Error(message);
        err.statusCode = statusCode;
        if (details) err.details = details;
        throw err;
    });
});