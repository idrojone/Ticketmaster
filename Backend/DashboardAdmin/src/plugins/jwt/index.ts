import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';

export default fp(async (server, opts) => {
    server.register(fastifyJwt, {
        secret: server.config.JWT_SECRET,
        sign: {
            expiresIn: server.config.JWT_EXPIRE_IN || '1h'
        },
        verify: {
            extractToken: (request: FastifyRequest) => {
                return request.headers.authorization?.replace('Bearer ', '') || undefined;
            }
        }
    });

    server.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.code(401).send({ message: 'Unauthorized' });
        }
    });

    server.decorate('authenticateOptional', async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify();
        } catch (err) {
            // No hacer nada si la verificación falla
        }
    });
});