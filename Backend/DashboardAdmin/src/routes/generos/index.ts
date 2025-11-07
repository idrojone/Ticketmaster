import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { getGeneros, getGenero, onCreateGenero, onUpdateGenero, onActivateGeneroSchema, onStatusGeneroSchema } from './schema';
import { modelGeneros } from '../../models/generos';
import { Genero, Status } from '@prisma/client';


/**
 * 
 * Falta !!!!
 * - Validar que el nombre no exista ya al crear o actualizar
 * - Tests
 * - is_active
 * - status
 */

async function generosRoute(server: FastifyInstance) {
    
    /**
     * @route GET /generos
     * @description Obtener todos los géneros
     * @access Private (Requiere autenticación y rol)
     * @returns {Object} 200 - Lista de géneros con el total
     * @returns {Object} 500 - Error del servidor
     * @returns {Object} 401 - No autorizado
     */
    server.route({
        method: 'GET',
        url: '/generos',
        onRequest: [server.authenticate, server.authenticateRole],
        schema: getGeneros,
        handler: onGet
    });
    async function onGet (_: FastifyRequest, reply: FastifyReply) {
        const generos = await modelGeneros(server).getAllGeneros();
        return reply.code(200).send({ generos , total: generos.length });
    }

    /**
     * @route GET /generos/:slug
     * @description Obtener un género por su slug
     * @access Private (Requiere autenticación y rol)
     * @returns {Object} 200 - Género encontrado
     * @returns {Object} 404 - Género no encontrado
     * @returns {Object} 500 - Error del servidor
     * @returns {Object} 401 - No autorizado
     */
    server.route({
        method: 'GET',
        url: '/generos/:slug',
        onRequest: [server.authenticate, server.authenticateRole],
        schema: getGenero,
        handler: onGetGenero
    });
    async function onGetGenero (request: FastifyRequest<{Params: {slug: string}}>, reply: FastifyReply) {
        const genero = await modelGeneros(server).onGetGenero(request);
        return reply.code(200).send(genero);
    }

    /**
     * @route POST /generos
     * @description Crear un nuevo género
     * @access Private (Requiere autenticación y rol)
     * @returns {Object} 201 - Género creado
     * @returns {Object} 400 - Error en la creación del género
     * @returns {Object} 500 - Error del servidor
     * @returns {Object} 401 - No autorizado
     */
    server.route({
        method: 'POST',
        url: '/generos',
        onRequest: [server.authenticate, server.authenticateRole],
        schema: onCreateGenero,
        handler: onPost
    });
    async function onPost (request: FastifyRequest<{ Body: Genero }>, reply: FastifyReply) {
        const newGenero = await modelGeneros(server).onCreateGenero(request);
        return reply.code(201).send(newGenero);
    }

    /**
     * @route PUT /generos/:slug
     * @description Actualizar un género por su slug
     * @access Private (Requiere autenticación y rol)
     * @returns {Object} 200 - Género actualizado
     * @returns {Object} 400 - Error en la actualización del género
     * @returns {Object} 500 - Error del servidor
     * @returns {Object} 401 - No autorizado
     */

    server.route({
        method: 'PUT',
        url: '/generos/:slug',
        onRequest: [server.authenticate, server.authenticateRole],
        schema: onUpdateGenero,
        handler: onPut
    });
    async function onPut (request: FastifyRequest<{ Params: { slug: string }, Body: Genero }>, reply: FastifyReply) {
        const updatedGenero = await modelGeneros(server).onUpdateGenero(request);
        return reply.code(200).send(updatedGenero);
    }

    server.route({
        method: 'PATCH',
        url: '/generos/:slug/activate',
        onRequest: [server.authenticate, server.authenticateRole],
        schema: onActivateGeneroSchema,
        handler: onActivateGenero
    });
    async function onActivateGenero (request: FastifyRequest<{ Params: { slug: string }, Body: { is_active: boolean } }>, reply: FastifyReply) {
        const updatedGenero = await modelGeneros(server).onActivateGenero(request);
        return reply.code(200).send(updatedGenero);
    }

    server.route({
        method: 'PATCH',
        url: '/generos/:slug/status',
        onRequest: [server.authenticate, server.authenticateRole],
        schema: onStatusGeneroSchema,
        handler: onStatusGenero
    });
    async function onStatusGenero (request: FastifyRequest<{ Params: {slug: string }, Body: {status: Status } }>, reply: FastifyReply) {
        const updateGenero = await modelGeneros(server).onStatusGenero(request);
        return reply.code(200).send(updateGenero);
    }
}

export default fp(generosRoute);