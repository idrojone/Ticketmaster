import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'

async function testRoute(server: FastifyInstance, options: Record<string, any>) {

  server.route({
    method: 'GET',
    url: options.prefix +'test',
    handler: async (request, reply) => {
      return { message: 'Ruta de prueba cargada correctamente' };
    }
  });

}

export default fp(testRoute)