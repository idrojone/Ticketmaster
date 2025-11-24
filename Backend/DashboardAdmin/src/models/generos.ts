import { FastifyInstance, FastifyRequest } from 'fastify';
import { prisma } from '../plugins/prisma/index';
import { Genero, PrismaClient, Status } from '@prisma/client';

class ModelGeneros {
    private prisma: PrismaClient;
    private server: FastifyInstance;

    constructor(prismaClient: PrismaClient, server: FastifyInstance) {
        this.prisma = prismaClient;
        this.server = server;
    }

    /** 
     * Obtiene todos los géneros disponibles en la base de datos.
     * @returns {Promise<Genero[]>} Una promesa que resuelve a una lista de objetos Genero.
    */
    async getAllGeneros(){
        try {
            return await this.prisma.genero.findMany();
        } catch (error) {
            this.server.throwError(500, 'Error fetching all generos', error);
        }
    }

    /** 
     * Obtiene todos los id_genero de los géneros disponibles en la base de datos.
     * @returns {Promise<{ id_genero: string }[]>} Una promesa que resuelve a una lista de objetos con id_genero.
     * @throws {Error} Lanza un error si ocurre un problema al obtener los géneros.
    */
    async getAllGenerosIdGenero() {
        try {
            return await this.prisma.genero.findMany({
                select: {
                    id_genero: true,
                },
            });
        } catch (error) {
            this.server.throwError(500, 'Error fetching generos by id_genero', error);
        }
    }

    /**
     * Obtiene un género específico basado en su slug.
     * @param {string} slug - El slug del género a buscar.
     * @returns {Promise<Genero | null>} Una promesa que resuelve a un objeto Genero o null si no se encuentra.
     */
    async getGeneroBySlug(slug: string){
        try {
            return await this.prisma.genero.findUnique({
                where: { slug : slug, }
            });
        } catch (error) {
            this.server.throwError(500, 'Error buscando genero por slug', error);
        }
    }

    /**
     * Crea un nuevo género en la base de datos.
     * @param {Genero} NuevoGenero - El objeto Genero que se va a crear.
     * @returns {Promise<Genero>} Una promesa que resuelve al género creado.
     */
    async createGenero(NuevoGenero: Genero) {
        try {
            return await this.prisma.genero.create({
                data: NuevoGenero,
            });
        } catch (error) {
            this.server.throwError(400, 'Nuevos datos ya en uso', error);
        }
    }

    /** 
     * Actualiza los conciertos asociados a un género cuando el id_genero del género cambia.
     * @param {string} oldIdGenero - El id_genero antiguo del género.
     * @param {string} newIdGenero - El nuevo id_genero del género.
     * @returns {Promise<Prisma.BatchPayload>} Una promesa que resuelve al resultado de la actualización masiva.
    */
    async updateConciertosGeneroId(oldIdGenero: string, newIdGenero: string) {
        try {
            return await this.prisma.concierto.updateMany({
                where: { id_genero: oldIdGenero },
                data: { id_genero: newIdGenero },
            });
        } catch (error) {
            this.server.throwError(500, 'Error updating conciertos genero id', error);
        }
    }

    /**
     * Actualiza un género existente en la base de datos.
     * @param {string} slug - El slug del género a actualizar.
     * @param {Partial<Genero>} updatedData - Los datos actualizados del género.
     * @returns {Promise<Genero>} Una promesa que resuelve al género actualizado.
     */
    async updateGenero(slug: string, updatedData: Partial<Genero>) {
        try {
            return await this.prisma.genero.update({
                where: { slug: slug },
                data: updatedData,
            });
        } catch (error) {
            this.server.throwError(400, 'Nuevos datos ya en uso o no existe', error);
        }
    }

    /**
     * Verifica si un género con un slug específico ya existe en la base de datos.
     * @param {string} slug - El slug del género a verificar.
     * @returns {Promise<Genero | null>} Una promesa que resuelve al género si existe, o null si no existe.
     */
    async checkSlugExists(slug: string){
        try {
            return await this.prisma.genero.findUnique({
                where: { slug : slug, }
            });
        } catch (error) {
            this.server.throwError(500, 'Error checking slug existence', error);
        }
    }
    
    /**
     * Verifica si un género con un id_genero específico ya existe en la base de datos.
     * @param {string} id_genero - El id_genero del género a verificar.
     * @returns {Promise<Genero | null>} Una promesa que resuelve al género si existe, o null si no existe.
     */
    async checkid_generoExists(id_genero: string){
        try {
            return await this.prisma.genero.findUnique({
                where: { id_genero : id_genero, }
            });
        } catch (error) {
            this.server.throwError(500, 'Error checking id_genero existence', error);
        }
    }

    /**
     * Obtiene un género específico basado en su id_genero.
     * @param {string} id_genero - El id_genero del género a buscar.
     * @returns {Promise<Genero | null>} Una promesa que resuelve a un objeto Genero o null si no se encuentra.
     */
    async getGeneroById(id_genero: string){
        try {
            this.checkid_generoExists(id_genero);
            return await this.prisma.genero.findUnique({
                where: { id_genero : id_genero, }
            });
        } catch (error) {
            this.server.throwError(500, 'Error fetching genero by id_genero', error);
        }
    }

    /** 
     * Obtiene un género específico basado en su nombre.
     * @param {string} name - El nombre del género a buscar.
     * @returns {Promise<Genero | null>} Una promesa que resuelve a un objeto Genero o null si no se encuentra.
    */
    async getGeneroByName(name: string){
        try {
            return await this.prisma.genero.findUnique({
                where: { name : name }
            });
        } catch (error) {
            this.server.throwError(500, 'Error fetching genero by name', error);
        }
    }

    /**
     * Obtiene un género específico basado en su slug.
     * @param {FastifyRequest<{Params: {slug: string}}>} request - La solicitud Fastify que contiene el slug en los parámetros.
     * @returns {Promise<Genero>} Una promesa que resuelve a un objeto Genero.
     * @throws {Error} Lanza un error si el género no se encuentra.
     */
    async onGetGenero(request: FastifyRequest<{Params: {slug: string}}>) {
        const { slug } = request.params;
        const genero = await this.getGeneroBySlug(slug);
        if (!genero) {
            this.server.throwError(404, 'Genero not found');
        }
        return genero;
    }

    /**
     * Crea un nuevo género basado en los datos proporcionados en la solicitud.
     * @param {FastifyRequest<{Body: Genero}>} request - La solicitud Fastify que contiene los datos del nuevo género en el cuerpo.
     * @returns {Promise<Genero>} Una promesa que resuelve al género creado.
     * @throws {Error} Lanza un error si hay un problema al crear el género.
     */
    async onCreateGenero(request: FastifyRequest<{ Body: Genero }>) {
        
        const generoData = request.body;
        /**
         * Generar slug y estado inicial
         */

        generoData.slug = this.server.generateSlug(generoData.name);
        if (!generoData.slug) {
            this.server.throwError(500, 'Error generando el slug');
        }
        generoData.status = 'ACCEPTED';
        generoData.is_active = true;

        /**
         * Asignar imagen por defecto si no se proporciona ninguna
         */
        if (!generoData.img || generoData.img.trim() === '') {
            generoData.img = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXUPnDwr3HCGC-8Gm-34Gp3JRtRzmhrTwSEw&s";
        }
         
        /**
         * Generar id_genero único
         */
        generoData.id_genero = this.server.generateSlug(generoData.name);
        if (!generoData.id_genero) {
            this.server.throwError(500, 'Error generando el id del género');
        }

        /**
         * Crear el nuevo género
         */
        const newGenero = await this.createGenero(generoData);
        return newGenero;
    }

    /**
     * Actualiza un género existente basado en los datos proporcionados en la solicitud.
     * @param {FastifyRequest<{ Params: { slug: string }, Body: Genero }>} request - La solicitud Fastify que contiene el slug en los parámetros y los datos actualizados en el cuerpo.
     * @returns {Promise<Genero>} Una promesa que resuelve al género actualizado.
     * @throws {Error} Lanza un error si el género no se encuentra o si hay un problema al actualizarlo.
     */
    async onUpdateGenero(request: FastifyRequest<{ Params: { slug: string }, Body: Genero }>) {
        const { slug } = request.params;
        const updatedData = request.body;

        const genero = await this.getGeneroBySlug(slug);

        if (!genero) {
            this.server.throwError(404, 'Genero no encontrado');
        }

        /**
         * Si el nombre ha cambiado, actualizar el slug e id_genero
         */
        if (updatedData.name && updatedData.name !== genero.name) {
            const existingGenero = await this.getGeneroByName(updatedData.name);
            if (existingGenero) {
                this.server.throwError(400, 'El nombre del género ya existe');
            }
            updatedData.slug = this.server.generateSlug(updatedData.name);
        }

        if (updatedData.id_genero !== genero.id_genero && updatedData.id_genero) {
            if (!genero.id_genero) {
                this.server.throwError(500, 'Internal Server Error');
            }

            const oldId = genero.id_genero;

            if (!updatedData.id_genero) {
                this.server.throwError(400, 'El id_genero no puede estar vacío');
            }

            const newId = updatedData.id_genero;

            try {
                await this.updateConciertosGeneroId(oldId, newId);
            } catch (error) {
                this.server.throwError(500, 'Error updating conciertos with new id_genero');
            } 
        }

        const updatedGenero = await this.updateGenero(slug, updatedData);
        if (!updatedGenero) {
            this.server.throwError(400, 'Nuevos datos ya en uso o no existe');
        }
        return updatedGenero;
    }

    /** 
     * Actualiza el estado activo de un género existente en la base de datos.
     * @param {string} slug - El slug del género a actualizar.
     * @param {boolean} is_active - El nuevo estado activo del género.
     * @returns {Promise<Genero>} Una promesa que resuelve al género actualizado.
     * @throws {Error} Lanza un error si el género no se encuentra o si hay un problema al actualizarlo.
    */
    async patchGeneroActive (slug: string, is_active: boolean) {
        try {
            const updatedGenero = await this.prisma.genero.update({
                where: { slug },
                data: { is_active }
            });
            return updatedGenero;
        } catch (error) {
            this.server.throwError(500, 'Error patching genero');
        }
    }

    /**
     * Actualiza el estado de un género existente en la base de datos.
     * @param {string} slug - El slug del género a actualizar.
     * @param {Status} status - El nuevo estado del género.
     * @returns {Promise<Genero>} Una promesa que resuelve al género actualizado.
     */
    async patchGeneroStatus (slug: string, status: Status) {
        try {   

            const updateGenero = await this.prisma.genero.update({
                where: { slug },
                data: { status }
            });
            return updateGenero;
        } catch (error) {
            this.server.throwError(500, 'Error al actuilzar el status', error);
        }
    }

    /**
     * Actualiza el estado activo de un género existente en la base de datos.
     * @param {FastifyRequest<{ Params: { slug: string }, Body: { is_active: boolean } }>} request - La solicitud Fastify que contiene el slug en los parámetros y el nuevo estado activo en el cuerpo.
     * @returns {Promise<{ genero: Genero }>} Una promesa que resuelve al género actualizado.
     * @throws {Error} Lanza un error si el género no se encuentra o si hay un problema al actualizarlo.
     */
    async onActivateGenero(request: FastifyRequest<{ Params: { slug: string }, Body: { is_active: boolean } }>) {
        const { slug } = request.params;
        const { is_active } = request.body;

        const genero = await this.getGeneroBySlug(slug);

        if (!genero) {
            this.server.throwError(404, 'Genero no encontrado');
            return;
        }

        if (genero.is_active === is_active) {
            this.server.throwError(400, `El genero ya está ${is_active ? 'activo' : 'inactivo'}`);
            return;
        }

        const activar = await this.patchGeneroActive(slug, is_active);
        if (!activar) {
            this.server.throwError(404, 'Genero no encontrado');
        }
        
    
        return { genero: activar };
    }

    /**
     *  Actualiza el estado de un género existente en la base de datos.
     * @param {FastifyRequest<{Params: {slug: string }, Body: {status: Status }}>} request - La solicitud Fastify que contiene el slug en los parámetros y el nuevo estado en el cuerpo.
     * @returns {Promise<{ generos: Genero }>} Una promesa que resuelve al género actualizado.
     * @throws {Error} Lanza un error si el género no se encuentra o si hay un problema al actualizarlo.
     */
    async onStatusGenero(request: FastifyRequest<{Params: {slug: string }, Body: {status: Status }}>) {
        const { slug } = request.params;
        const { status } = request.body;

        /**
         * Validar que el género existe
         */
        const genero = await this.getGeneroBySlug(slug);
        if ( !genero) {
            this.server.throwError(404, 'Género no encontrado');
            return;
        }

        /**
         * Validar el estado del género
         */
        if (genero?.status === status) {
            this.server.throwError(400, `El género ya está en estado ${status}`);
            return;
        }

        /**
         * Actualizar status del género
         */
        const updateConcierto = await this.patchGeneroStatus(slug, status);
        if (!updateConcierto) {
            this.server.throwError(404, 'Género no encontrado');
        }

        return { generos: updateConcierto };
    }

    /**
     * Obtiene todos los id_genero de los géneros disponibles en la base de datos.
     * @returns {Promise<{ generos: { id_genero: string }[] }>} Una promesa que resuelve a un objeto con una lista de id_genero.
     */
    async onGetGenerosIdGenero() {
        const generos =  await this.getAllGenerosIdGenero();
        return { generos };
    }
}   

export const modelGeneros = (server: FastifyInstance) => new ModelGeneros(prisma, server);