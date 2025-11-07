import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { getConciertos, onCreateConcierto, getConciertoBySlug, onUpdateConciertoActivateSchema, onUpdateConciertoSchema, onUpdateConciertoStatusSchema, deleteConcierto } from './schema';
import { modelConciertos } from '../../models/conciertos';
import { Concierto, Status } from '@prisma/client';



/**
 * Falta !!!
 */
async function conciertosRoutes(server: FastifyInstance) {

    /**
     * @route GET /conciertos
     * @description Obtener todos los conciertos
     * @access Private (Requiere autenticación y rol)
     * @returns {Object} 200 - Lista de conciertos con el total
     * @returns {Object} 500 - Error del servidor
     * @returns {Object} 401 - No autorizado
     */

    server.route({
        method: 'GET',
        url: '/conciertos',
        onRequest: [server.authenticate, server.authenticateRole],
        schema: getConciertos,
        handler : onGet
    });
    async function onGet(_: FastifyRequest, reply: FastifyReply) {
        const conciertos = await modelConciertos(server).getAllConciertos();
        return reply.code(200).send({ total: conciertos.length, conciertos });
    }

    /**
     * @route GET /conciertos/:slug
     * @description Obtener un concierto por su slug
     * @access Private (Requiere autenticación y rol)
     * @returns {Object} 200 - Concierto encontrado
     * @returns {Object} 404 - Concierto no encontrado
     * @returns {Object} 500 - Error del servidor
     * @returns {Object} 401 - No autorizado
     */

    server.route({
        method: 'GET',
        url: '/conciertos/:slug',
        onRequest: [server.authenticate, server.authenticateRole],
        schema: getConciertoBySlug,
        handler : onGetBySlug
    });
    async function onGetBySlug(request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
        const result = await modelConciertos(server).onGetBySlug(request);
        return reply.code(200).send(result);
    }

    /**
     * @route POST /concierto
     * @description Crear concierto
     * @access Private (Requiere autenticación y rol)
     * @returns {Object} 200 - Crea concierto
     * @returns {Object} 400 - Datos inválidos
     * @returns {Object} 401 - No autorizado
     * @returns {Object} 404 - Género no encontrado
     * @returns {Object} 500 - Error del servidor
     */
    server.route({
        method: 'POST',
        url: '/conciertos',
        onRequest: [server.authenticate, server.authenticateRole],
        schema: onCreateConcierto,
        handler : onPost
    });
    async function onPost(request: FastifyRequest<{ Body: Concierto }>, reply: FastifyReply) {
        const concierto = await modelConciertos(server).onCreateConcierto(request);
        return reply.code(201).send(concierto);        
    }

    /**
     * @route PUT /conciertos/:slug
     * @description Actualizar un concierto por su slug
     * @access Private (Requiere autenticación y rol)
     * @returns {Object} 200 - Concierto actualizado
     * @returns {Object} 404 - Concierto no encontrado
     * @returns {Object} 500 - Error del servidor
     * @returns {Object} 401 - No autorizado
     */
    server.route({
        method: 'PUT',
        url: '/conciertos/:slug',
        onRequest: [server.authenticate, server.authenticateRole],
        schema: onUpdateConciertoSchema,
        handler: onUpdateConcierto
    });
    async function onUpdateConcierto(request: FastifyRequest<{ Params: { slug: string }, Body: Concierto }>, reply: FastifyReply) {
        const concierto = await modelConciertos(server).onUpdateConcierto(request);
        return reply.code(200).send(concierto);
    }

    /**
     * @route PATCH /conciertos/:slug/activate
     * @description Activar o desactivar un concierto por su slug
     * @access Private (Requiere autenticación y rol)
     * @returns {Object} 200 - Concierto actualizado
     * @returns {Object} 404 - Concierto no encontrado
     * @returns {Object} 400 - El concierto ya está en el estado solicitado
     * @returns {Object} 500 - Error del servidor
     * @returns {Object} 401 - No autorizado
     */
    server.route({
        method: 'PATCH',
        url: '/conciertos/:slug/activate',
        onRequest: [server.authenticate, server.authenticateRole],
        schema: onUpdateConciertoActivateSchema,
        handler: onActivateConcierto
    });
    async function onActivateConcierto(request: FastifyRequest<{ Params: { slug: string }, Body: { is_active: boolean } }>, reply: FastifyReply) {
        const updatedConcierto = await modelConciertos(server).onActivateConcierto(request);
        return reply.code(200).send(updatedConcierto);
    }

    /**
     * @route PATCH /conciertos/:slug/status
     * @description Actualizar el estado de un concierto por su slug
     * @access Private (Requiere autenticación y rol)
     * @returns {Object} 200 - Concierto actualizado
     * @returns {Object} 404 - Concierto no encontrado
     * @returns {Object} 400 - El concierto ya está en el estado solicitado
     * @returns {Object} 500 - Error del servidor
     * @returns {Object} 401 - No autorizado
     */
    server.route({
        method: 'PATCH',
        url: '/conciertos/:slug/status',
        onRequest: [server.authenticate, server.authenticateRole],
        schema: onUpdateConciertoStatusSchema,
        handler: onUpdateConciertoStatus
    });
    async function onUpdateConciertoStatus(request: FastifyRequest<{ Params: { slug: string }, Body: { status: Status } }>, reply: FastifyReply) {
        const updateConcierto = await modelConciertos(server).onUpdateConciertoStatus(request);
        return reply.code(200).send(updateConcierto);
    }

    /**
     * @route DELETE /conciertos/:slug
     * @description Eliminar un concierto por su slug
     * @access Private (Requiere autenticación y rol)
     * @returns {Object} 200 - Concierto eliminado
     * @returns {Object} 404 - Concierto no encontrado
     * @returns {Object} 500 - Error del servidor
     * @returns {Object} 401 - No autorizado
     */
    server.route({
        method: 'DELETE',
        url: '/conciertos/:slug',
        schema: deleteConcierto,
        onRequest: [server.authenticate, server.authenticateRole],
        handler: onDeleteConcierto
    });
    async function onDeleteConcierto(request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
        const deleted = await modelConciertos(server).onDeleteConcierto(request);
        return reply.code(200).send(deleted);
    }
}

export default fp(conciertosRoutes);