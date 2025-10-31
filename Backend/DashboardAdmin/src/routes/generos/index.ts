import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'
import { getGeneros,getGenero } from './schema'
import { modelGeneros } from '../../models/generos'

async function generosRoute(server: FastifyInstance, options: Record<string, any>) {
    // console.log(server.optionsEnvHOST);
    server.route({
    method: 'GET',
    url: options.prefix +'generos',
    schema: getGeneros,
    handler: onGet
    })
    async function onGet (request: any, reply: any) {
        // console.log("GET /generos llamado , datos:", await modelGeneros.getAllGeneros());
        // console.log(server.optionsEnv.API_PORT);

        return await modelGeneros.getAllGeneros();
    }

}

export default fp(generosRoute)