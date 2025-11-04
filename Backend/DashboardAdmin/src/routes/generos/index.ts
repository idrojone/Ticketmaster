import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'
import { getGeneros,getGenero,onCreateGenero,onUpdateGenero } from './schema'
import { modelGeneros } from '../../models/generos'

async function generosRoute(server: FastifyInstance, options: Record<string, any>) {
    server.route({
        method: 'GET',
        url: '/generos',
        onRequest: [server.authenticate, server.authenticateRole],
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
        onRequest: [server.authenticate, server.authenticateRole],
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
        onRequest: [server.authenticate, server.authenticateRole],
        schema: onCreateGenero,
        handler: onPost
    })
    async function onPost (request: any, reply: any) {
        try {
            const generoData = await request.body;

            generoData.slug = await modelGeneros.generateSlug(generoData.name);
            generoData.status = 'PENDING';
            generoData.is_active = true;
            generoData.createdAt = new Date().toISOString();
            generoData.updatedAt = new Date().toISOString();
            generoData.img = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXUPnDwr3HCGC-8Gm-34Gp3JRtRzmhrTwSEw&s";
            generoData.id_genero = await modelGeneros.generateSlug(generoData.name);

            const newGenero = await modelGeneros.createGenero(generoData);

            if ( newGenero === false ) {
                return reply.code(400).send({ error: 'Error creating genero' });
            }else{
                return reply.code(201).send(newGenero);
            }

        } catch (error) {
            console.error('Error creating genero:', error);
            return reply.code(500).send({ error: 'Internal Server Error' });
        }
    }

    server.route({
        method: 'PUT',
        url: '/generos/:slug',
        onRequest: [server.authenticate, server.authenticateRole],
        schema: onUpdateGenero,
        handler: onPut
    })
    async function onPut (request: any, reply: any) {
        try {
            const slug = request.params.slug;
            const updatedData = await request.body;
            updatedData.updatedAt = new Date().toISOString();

            const updatedGenero = await modelGeneros.updateGenero(slug, updatedData);

            if (updatedGenero) {
                return reply.code(200).send(updatedGenero);
            } else {
                return reply.code(400).send({ message: 'Nuevos datos ya en uso o no existe ' });
            }

        }catch (error) {
            console.error('Error updating genero:', error);
            return reply.code(500).send({ error: 'Internal Server Error' });
        }
    }
}

export default fp(generosRoute)