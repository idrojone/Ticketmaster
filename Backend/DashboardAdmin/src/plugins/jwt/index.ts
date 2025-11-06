import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default fp(async (server: FastifyInstance) => {
    server.register(fastifyJwt, {
        secret: server.optionsEnv.JWT_SECRET,
        sign: {
            expiresIn: server.optionsEnv.JWT_EXPIRES_IN || '1h'
        },
        verify: {
            extractToken: (request: FastifyRequest) => {
                return request.headers.authorization?.replace('Bearer ', '') || undefined;
            }
        }
    });

    /**
     *  Generar AccessToken
     */

    server.decorate('generateAccessToken', async function (username: string, reply: FastifyReply) {
        return await reply.jwtSign(
            { username: username, role: 'admin' },
        );
    });


    /**
     * Middelware 
     */

    server.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.code(401).send({ message: 'Unauthorized' });
        }
    });

    /**
     * Middelware de rol
     */
    server.decorate('authenticateRole', async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify();
            const user = (request as any).user;
            if (!user || user.role !== 'admin') {
                return reply.code(403).send({ message: 'No tienes permisos para acceder a este recurso' });
            }
        } catch (err) {
            reply.code(401).send({ message: 'Unauthorized' });
        }
    })
});