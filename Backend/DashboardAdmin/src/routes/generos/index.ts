import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'
import getAllGeneros from '../../controllers/generos'
import { generoSchema } from '../../schemas/generos';

async function generosRoute(server: FastifyInstance, options: Record<string, any>) {

  server.route({
    method: 'GET',
    url: options.prefix +'generos',
    // schema
    handler: async (request, reply) => {
    //   return getAllGeneros(server);
    }
  });

}

export default fp(generosRoute)