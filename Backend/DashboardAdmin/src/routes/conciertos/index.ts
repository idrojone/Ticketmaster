import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { getConciertos, onCreateConcierto, CreateConciertoBody } from './schema';
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
     * @route POST /concierto
     * @description Crear concierto
     * @access Private (Requiere autenticación y rol)
     * @returns {Object} 200 - Crea concierto
     * @returns {Object} 400 - 
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

            return reply.code(200).send(newConcierto);

        } catch (error) {
            server.throwError(500, 'Error procesando la solicitud');
        }
    }
}

export default fp(conciertosRoutes);