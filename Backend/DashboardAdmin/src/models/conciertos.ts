import { Concierto, Status, PrismaClient } from "@prisma/client";
import { prisma } from "../plugins/prisma";
import { FastifyInstance, FastifyRequest } from "fastify";

class ModelConciertos {
    private prisma: PrismaClient;
    private server: FastifyInstance;

    constructor(prismaClient: PrismaClient, server: FastifyInstance) {
        this.prisma = prismaClient;
        this.server = server;
    }

    /**
     * Obtener todos los conciertos
     * @returns  {Promise<Concierto[]>}
     */
    async getAllConciertos() {
        try {
            const conciertos = await this.prisma.concierto.findMany();
            return conciertos;
        } catch (error) {
            console.error('Error fetching conciertos:', error);
            throw error;
        }
    }

    /**
     * Crear un nuevo concierto
     * @param {CreateConciertoData} conciertoData - Datos del concierto a crear
     * @returns  {Promise<Concierto>}
     */
    async createConcierto(conciertoData: Concierto) {
        try {
            const newConcierto = await this.prisma.concierto.create({
                data: conciertoData
            });
            return newConcierto;
        } catch (error) {
            console.error('Error creating concierto:', error);
            throw error;
        }
    }

    /**
     * Obtener un concierto por slug
     * @param {string} slug - Slug del concierto
     * @returns {Promise<Concierto|null>}
     */
    async getConciertoBySlug(slug: string) {
        try {
            const concierto = await this.prisma.concierto.findUnique({
                where: { slug }
            });
            return concierto;
        } catch (error) {
            console.error('Error fetching concierto by slug:', error);
            throw error;
        }
    }

    /**
     * Actualizar un concierto existente
     * @param {string} slug - Slug del concierto a actualizar
     * @param {UpdateConciertoData} updateData - Datos a actualizar
     * @returns {Promise<Concierto>}
     */
    async updateConcierto(slug: string, updateData: Concierto) {
        console.log('Updating concierto with data:', updateData);
        try {
            const updatedConcierto = await this.prisma.concierto.update({
                where: { slug },
                data: updateData
            });
            return updatedConcierto;
        } catch (error) {
            console.error('Error updating concierto:', error);
            throw error;
        }
    }

    /**
     * 
     * @param { string } slug 
     * @param  { boolean } is_active 
     * @returns 
     */
    async patchConciertoActive(slug: string, is_active: boolean) {
        console.log('Patching concierto with data:', { is_active });
        try {
            const patchedConcierto = await this.prisma.concierto.update({
                where: { slug },
                data: { is_active }
            });
            return patchedConcierto;
        } catch (error) {
            console.error('Error patching concierto:', error);
            throw error;
        }
    }

    /**
     * Actualiza el estado de un concierto por su slug
     * @param {string} slug - Slug del concierto a actualizar
     * @param {Status} status - Nuevo estado del concierto
     * @returns {Promise<Concierto>}
     */
    async patchConciertoStatus(slug: string, status: Status) {
        console.log('Patching concierto with data:', { status });
        try {
            const patchedConcierto = await this.prisma.concierto.update({
                where: { slug },
                data: { status }
            });
            return patchedConcierto;
        } catch (error) {
            console.error('Error patching concierto:', error);
            throw error;
        }
    }

    /**
     * Eliminar un concierto por slug
     * @param {string} slug - Slug del concierto a eliminar
     * @returns {Promise<Concierto>}
     */
    async deleteConcierto(slug: string) {
        try {
            const deletedConcierto = await this.prisma.concierto.delete({
                where: { slug }
            });
            return deletedConcierto;
        } catch (error) {
            console.error('Error deleting concierto:', error);
            throw error;
        }
    }

    /**
    * Actualiza el id_genero de los conciertos relacionados al género
    * @param {string} oldId - El id_genero antiguo
    * @param {string} newId - El id_genero nuevo
    * @returns {Promise<number>} - El número de conciertos actualizados
    */
    async updateConciertosGeneroId(oldId: string, newId: string) {
        try {
            const updatedConciertos = await this.prisma.concierto.updateMany({
                where: { id_genero: oldId },
                data: { id_genero: newId }
            });
            return updatedConciertos;
        } catch (error) {
            console.error('Error updating conciertos genero id:', error);
            throw error;
        }
    }

    /**
     * Manejador de ruta para obtener un concierto por slug
     * @param {FastifyRequest<{ Params: { slug: string } }>} request - La solicitud Fastify
     * @returns {Promise<Concierto | void>}
     */
    async onGetBySlug(request: FastifyRequest<{ Params: { slug: string } }>) {
        const { slug } = request.params;
        const concierto = await this.getConciertoBySlug(slug);
        if (!concierto) this.server.throwError(404, 'Concierto no encontrado');
        return concierto;
    }

    /**
     * Manejador de ruta para crear un nuevo concierto
     * @param {FastifyRequest<{ Body: Concierto }>} request - La solicitud Fastify
     * @returns {Promise<Concierto | void>}
     */
    async onCreateConcierto(request: FastifyRequest<{ Body: Concierto }>) {
        const conciertoData = request.body;

        /**
        *  Generar slug y estado inicial
        */
        conciertoData.slug = this.server.generateSlug(conciertoData.nombre);
       
        if (!conciertoData.slug) {
            console.log('Error')
            this.server.throwError(500, 'Error generando el slug del concierto');
        }
        conciertoData.status = 'ACCEPTED';
        conciertoData.is_active = true;

        // Asegurar que los campos numéricos sean del tipo correcto
        if (conciertoData.precio !== undefined) conciertoData.precio = Number(conciertoData.precio) as any;
        if (conciertoData.aforo !== undefined) conciertoData.aforo = Number(conciertoData.aforo) as any;
        if (conciertoData.duracion !== undefined) conciertoData.duracion = Number(conciertoData.duracion) as any;

        // Asegurar que imagenesShow sea un array
        if (!Array.isArray(conciertoData.imagenesShow)) {
            conciertoData.imagenesShow = [] as any;
        }

        /**
         * Obtener imagen del artista desde la API de Spotify
         */
        if (!conciertoData.imagenArtista) {
            const spotifyImage = await this.server.spotify(conciertoData.artista);
            if (!spotifyImage) {
                this.server.throwError(500, 'Error obteniendo la imagen del artista desde Spotify');
            }
            conciertoData.imagenArtista = spotifyImage.url;
        }

        /**
         * Validar que el id del id_genero exista
         */

        const genero = await this.prisma.genero.findUnique({
            where: { id_genero: conciertoData.id_genero }
        });
        if (!genero) {
            this.server.throwError(404, 'Género no encontrado');
        }

        let merchid;
        try {
            const res = await this.server.axiosClient.get('/merch-random');
            console.log(res.data);
            merchid = res.data;
        } catch (err: any) {
            console.error('Error fetching merch-random:', err?.message ?? err);
            this.server.throwError(500, 'Error connecting to merchandising service');
        }
        if (!merchid) {
            this.server.throwError(500, 'No hay merchandising disponible');
        }
        conciertoData.merchandisingId = (merchid && typeof merchid === 'string') ? merchid : (merchid?.data || (merchid?.merchandisingId || '')) as any;

        console.log('Merchandising ID:', conciertoData.merchandisingId);
        console.log('Concierto Data before creation:', conciertoData);
        /**
         * Crear concierto
         */
        const newConcierto = await this.createConcierto(conciertoData);
        if (!newConcierto) {
            this.server.throwError(500, 'Error creando el concierto');
        }

        /**
         * Retornar nuevo concierto creado sin id, envuelto como { concierto }
         */
        const { id, ...conciertoWithoutId } = newConcierto;
        return { concierto: conciertoWithoutId };
    }

    /**
     * Manejador de ruta para actualizar un concierto existente
     * @param {FastifyRequest<{ Params: { slug: string }, Body: Concierto }>} request - La solicitud Fastify
     * @returns {Promise<Concierto | void>}
     */
    async onUpdateConcierto(request: FastifyRequest<{ Params: { slug: string }, Body: Concierto }>) {

        const { slug } = request.params;
        const updateData = request.body;

        const concierto = await this.getConciertoBySlug(slug);
        if (!concierto) {
            this.server.throwError(404, 'Concierto no encontrado');
            return;
        }

        // Asegurar que los campos numéricos sean del tipo correcto
        if (updateData.precio !== undefined) updateData.precio = Number(updateData.precio) as any;
        if (updateData.aforo !== undefined) updateData.aforo = Number(updateData.aforo) as any;
        if (updateData.duracion !== undefined) updateData.duracion = Number(updateData.duracion) as any;

        /**
         * Cambiar la imagen si el nombre del artista ha cambiado
         */

        if (updateData.artista !== concierto.artista) {
            const spotifyImage = await this.server.spotify(updateData.artista);
            updateData.imagenArtista = spotifyImage ? spotifyImage.url : '';
        }

        /**
         *  Validar y actualizar id_genero si ha cambiado
         */

        if (updateData.id_genero !== concierto.id_genero) {
            // FALTA TRY CATCH
            const genero = await this.prisma.genero.findUnique({
                where: { id_genero: updateData.id_genero }
            });
            if (!genero) {
                this.server.throwError(404, 'Género no encontrado');
                return;
            }
            if (!genero.id_genero) {
                this.server.throwError(400, 'El género no tiene un id_genero válido');
                return;
            }
            updateData.id_genero = genero.id_genero;
        }

        /**
         * Actualizar slug si el nombre ha cambiado
         */
        if (updateData.nombre !== concierto.nombre) {
            updateData.slug = this.server.generateSlug(updateData.nombre);
        }

        const updatedConcierto = await this.updateConcierto(slug, updateData);
        if (!updatedConcierto) {
            this.server.throwError(500, 'Error actualizando el concierto');
            return;
        }

        /**
         * Retornar el concierto actualizado
         */

        const { id, ...conciertoWithoutId } = updatedConcierto;
        return { concierto: conciertoWithoutId };
    }

    /**
     * Manejador de ruta para actualizar el estado de actividad de un concierto
     * @param {FastifyRequest<{ Params: { slug: string }, Body: { is_active: boolean } }>} request - La solicitud Fastify
     * @returns {Promise<Concierto | void>}
     */
    async onActivateConcierto(request: FastifyRequest<{ Params: { slug: string }, Body: { is_active: boolean } }>) {
        const { slug } = request.params;
        const { is_active } = request.body;

        /**
         * Validar que el concierto existe
         */
        const concierto = await this.getConciertoBySlug(slug);
        if (!concierto) {
            this.server.throwError(404, 'Concierto no encontrado');
            return;
        }

        /**
         * Validar que el estado no sea el mismo que el actual
         */
        if (concierto.is_active === is_active) {
            this.server.throwError(400, `El concierto ya está ${is_active ? 'activo' : 'inactivo'}`);
            return;
        }

        /**
         * Actualizar el estado de actividad del concierto
         */
        const updatedConcierto = await this.patchConciertoActive(slug, is_active);
        if (!updatedConcierto) {
            this.server.throwError(404, 'Concierto no encontrado');
            return;
        }

        return { concierto: updatedConcierto };
    }

    /**
     * Manejador de ruta para actualizar el estado de un concierto
     * @param {FastifyRequest<{ Params: { slug: string }, Body: { status: Status } }>} request - La solicitud Fastify
     * @returns {Promise<Concierto | void>}
     */
    async onUpdateConciertoStatus(request: FastifyRequest<{ Params: { slug: string }, Body: { status: Status } }>) {
        const { slug } = request.params;
        const { status } = request.body;

        /**
         * Validar que el concierto existe
         */
        const concierto = await this.getConciertoBySlug(slug);
        if (!concierto) {
            this.server.throwError(404, 'Concierto no encontrado');
            return;
        }

        /**
         * Validar que el estado no sea el mismo que el actual
         */
        if (concierto.status === status) {
            this.server.throwError(400, `El concierto ya está en estado ${status}`);
            return;
        }

        /**
         * Actualizar el estado del concierto
         */
        const updatedConcierto = await this.patchConciertoStatus(slug, status);
        if (!updatedConcierto) {
            this.server.throwError(404, 'Concierto no encontrado');
            return;
        }

        return { concierto: updatedConcierto };
    }

    async onDeleteConcierto(request: FastifyRequest<{ Params: { slug: string } }>) {
        const { slug } = request.params;

        const concierto = await this.getConciertoBySlug(slug);
        if (!concierto) {
            this.server.throwError(404, 'Concierto no encontrado');
            return;
        }
        const deletedConcierto = await this.deleteConcierto(slug);
        if (!deletedConcierto) {
            this.server.throwError(500, 'Error eliminando el concierto');
            return;
        }
        return { concierto: deletedConcierto };
    }
}

export const modelConciertos = (server: FastifyInstance) => new ModelConciertos(prisma, server);