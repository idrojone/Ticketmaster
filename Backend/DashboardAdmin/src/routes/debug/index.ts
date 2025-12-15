import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default fp(async (server: FastifyInstance) => {
  server.route({
    method: 'GET',
    url: '/debug/error',
    handler: async (_request: FastifyRequest, reply: FastifyReply) => {
      server.throwError(418, 'Prueba de error desde /debug/error');
      return reply;
    },
  });

  server.route({
    method: 'GET',
    url: '/debug/ping',
    handler: async (_request: FastifyRequest, reply: FastifyReply) => {
      return reply.send({ message: 'pong' });
    },
  });

  server.route({
    method: 'GET',
    url: '/debug/axios',
    handler: async (_request: FastifyRequest, reply: FastifyReply) => {
      const merchandising = await server.axiosClient.get('/merch-random');
      return reply.send({ merchandising });
    },
  });
});
