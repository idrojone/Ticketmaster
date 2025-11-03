import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'
import { getGeneros,getGenero,onCreateGenero } from './schema'
import { modelGeneros } from '../../models/generos'

async function generosRoute(server: FastifyInstance, options: Record<string, any>) {
    // console.log(server.optionsEnvHOST);
    server.route({
        method: 'GET',
        url: '/generos',
        schema: getGeneros,
        handler: onGet
    })
    async function onGet (request: any, reply: any) {
        try {
            const generos = await modelGeneros.getAllGeneros();
            return reply.code(200).send({ generos , total: generos.length });
        } catch (error) {
            console.error('Error fetching generos:', error);
            return reply.code(500).send({ error: 'Internal Server Error' });
        }       
    }

    server.route({
        method: 'GET',
        url: '/generos/:slug',
        schema: getGenero,
        handler: onGetGenero
    })
    async function onGetGenero (request: any, reply: any) {
        try {
            const slug = request.params.slug;
            const genero = await modelGeneros.getGeneroBySlug(slug);
            if (genero) {
                return reply.code(200).send(genero);
            } else {
                return reply.code(404).send({ message: 'Genero not found' });
            }
        } catch (error) {
            console.error('Error fetching genero by name:', error);
            return reply.code(500).send({ error: 'Internal Server Error' });
        }
    }

    server.route({
        method: 'POST',
        url: '/generos',
        schema: onCreateGenero,
        handler: onPost
    })
    async function onPost (request: any, reply: any) {

    }
}

export default fp(generosRoute)