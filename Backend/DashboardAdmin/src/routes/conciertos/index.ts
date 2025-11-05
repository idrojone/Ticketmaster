import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { getConciertos, onCreateConcierto, CreateConciertoBody, getConciertoBySlug, onUpdateConciertoActivateSchema, onUpdateConciertoSchema, onUpdateConciertoStatusSchema, deleteConcierto } from './schema';
import { modelConciertos } from '../../models/conciertos';
import { modelGeneros } from '../../models/generos';

async function conciertosRoutes(server: FastifyInstance , options: Record<string, any>) {

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
    })
    async function onGet(_: FastifyRequest, reply: FastifyReply) {
        try {
            const conciertos = await modelConciertos.getAllConciertos();
            return reply.code(200).send({ conciertos, total: conciertos.length });
        } catch (error) {
            server.throwError(500, 'Error obteniendo conciertos');
        }
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
    })
    async function onGetBySlug(request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
        try {
            const { slug } = request.params;
            const concierto = await modelConciertos.getConciertoBySlug(slug);
            if (!concierto) return reply.code(404).send({ message: 'Concierto no encontrado' });
            return reply.code(200).send(concierto);
        } catch (error) {
            server.throwError(500, 'Error obteniendo concierto por slug');
        }
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
    })
    async function onPost(request: FastifyRequest<{ Body: CreateConciertoBody }>, reply: FastifyReply) {
        try {

            const conciertosData = request.body;

            /**
             * Generar slug y estado inicial del concierto
             */
            conciertosData.slug = server.generateSlug(conciertosData.nombre);
            console.log('Slug generado:', conciertosData.slug);
            conciertosData.status = 'PENDING';
            conciertosData.is_active = true;
            
            /**
             * Obtener imagen del artista desde la API de Spotify
             */
            const spotifyImage = await server.spotify(conciertosData.artista);
            conciertosData.imagenArtista = spotifyImage ? spotifyImage.url : '';

            /**
             * Validar que id_genero es una cadena de texto válida
             */
            let id_genero =  conciertosData.id_genero;

            if (typeof id_genero !== 'string' || id_genero.trim() === '') {
                server.throwError(404, 'El campo id_genero es obligatorio y debe ser una cadena de texto válida');
            }

            /**
             * Encontrar el id del id_genero
             */
            const  genero = await modelGeneros(server).getGeneroById(id_genero);

            if (!genero) return reply.code(404).send({ message: 'El género indicado no existe' });
            
            /**
             *  Update id_genero
             */
            const generoResuelto: string = genero.id; 
            conciertosData.id_genero = generoResuelto;

            /**
             * Crear Concierto
             */
            const newConcierto = await modelConciertos.createConcierto(conciertosData);

            /**
             * Excluir el id de la respuesta para que coincida con el schema
             */
            const { id, ...conciertoSinId } = newConcierto;

            return reply.code(200).send(conciertoSinId);

        } catch (error) {
            server.throwError(500, 'Error procesando la solicitud');
        }
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
    })
    async function onUpdateConcierto(request: FastifyRequest<{ Params: { slug: string }, Body: CreateConciertoBody }>, reply: FastifyReply) {
        try {
            const { slug } = request.params;
            const updateData = request.body;
            
            const concierto = await modelConciertos.getConciertoBySlug(slug);
            if (!concierto) return reply.code(404).send({ message: 'Concierto no encontrado' });

            /**
             * Cambiar la imagen si el nombre del artista cambia
             */
            if (updateData.artista !== concierto.artista) {
                const spotifyImage = await server.spotify(updateData.artista);
                updateData.imagenArtista = spotifyImage ? spotifyImage.url : '';
            }

            /**
             * Validar y actualizar id_genero si ha cambiado
             */
            if (updateData.id_genero !== concierto.id_genero) {
                const genero = await modelGeneros(server).getGeneroById(updateData.id_genero);
                if (!genero) return reply.code(404).send({ message: 'El género indicado no existe' });
                if (!genero.id_genero) return reply.code(400).send({ message: 'El género no tiene un id_genero válido' });
                updateData.id_genero = genero.id_genero;
            }

            /**
             * Actualizar slug si el nombre del concierto cambia
             */

            if (updateData.nombre !== concierto.nombre) {
                updateData.slug = server.generateSlug(updateData.nombre);
            }

            /**
             * Actualizar el concierto
             */
            const updatedConcierto = await modelConciertos.updateConcierto(slug, updateData);
            if (!updatedConcierto) {
                return reply.code(404).send({ message: 'Concierto no encontrado' });
            }

            /**
             * Excluir el id de la respuesta para que coincida con el schema
             */
            const { id, ...conciertoSinId } = updatedConcierto;

            return reply.code(200).send({ concierto: conciertoSinId });
        } catch (error) {
            server.throwError(500, 'Error actualizando concierto');
        }
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
    })
    async function onActivateConcierto(request: FastifyRequest<{ Params: { slug: string }, Body: { is_active: boolean } }>, reply: FastifyReply) {
        try {
            const { slug } = request.params;
            const { is_active } = request.body;

            /**
             * Validar que el concierto existe
             */
            const concierto = await modelConciertos.getConciertoBySlug(slug);
            if (!concierto) return reply.code(404).send({ message: 'Concierto no encontrado' });

            /**
             * Validar que el estado no sea el mismo que el actual
             */
            if (concierto.is_active === is_active) {
                return reply.code(400).send({ message: `El concierto ya está ${is_active ? 'activo' : 'inactivo'}` });
            }

            /**
             * Actualizar el estado de actividad del concierto
             */
            const updatedConcierto = await modelConciertos.updateConcierto(slug, { is_active });
            if (!updatedConcierto) {
                return reply.code(404).send({ message: 'Concierto no encontrado' });
            }
            return reply.code(200).send({ concierto: updatedConcierto });
        } catch (error) {
            server.throwError(500, 'Error actualizando estado de actividad del concierto');
        }
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
    })
    async function onUpdateConciertoStatus(request: FastifyRequest<{ Params: { slug: string }, Body: { status: 'PENDING' | 'APPROVED' | 'REJECTED' } }>, reply: FastifyReply) {
        try {
            const { slug } = request.params;
            const { status } = request.body;
            
            /**
             * Validar que el concierto existe
             */
            const concierto = await modelConciertos.getConciertoBySlug(slug);
            if (!concierto) return reply.code(404).send({ message: 'Concierto no encontrado' });
           
            /**
             * Validar que el estado no sea el mismo que el actual
             */
            if (concierto.status === status) {
                return reply.code(400).send({ message: `El concierto ya está en estado ${status}` });
            }

            /**
             * Actualizar el estado del concierto
             */
            const updatedConcierto = await modelConciertos.updateConcierto(slug, { status });
           
            /**
             * Validar que la actualización fue exitosa
             */
            if (!updatedConcierto) {
                return reply.code(404).send({ message: 'Concierto no encontrado' });
            }

            return reply.code(200).send({ concierto: updatedConcierto });
        } catch (error) {
            server.throwError(500, 'Error actualizando estado del concierto');
        }
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
    })
    async function onDeleteConcierto(request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
        try {
            const { slug } = request.params;
            const deleted = await modelConciertos.deleteConcierto(slug);
            if (!deleted) {
                return reply.code(404).send({ message: 'Concierto no encontrado' });
            }
            return reply.code(200).send({ message: 'Concierto eliminado correctamente' });
        } catch (error) {
            server.throwError(500, 'Error eliminando concierto');
        }
    }
}

export default fp(conciertosRoutes);