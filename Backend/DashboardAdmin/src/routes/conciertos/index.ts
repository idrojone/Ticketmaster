import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

async function conciertosRoutes(server: FastifyInstance , options: any) {

    server.route({
        method: 'GET',
        url: '/conciertos',
        handler : onGet
        
    })
    async function onGet(request: any, reply: any) {

    }
}

export default fp(conciertosRoutes);