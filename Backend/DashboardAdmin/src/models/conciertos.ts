import { Concierto, Status, PrismaClient } from "@prisma/client";
import { prisma } from "../plugins/prisma";

class ModelConciertos {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
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
}

export const modelConciertos = new ModelConciertos(prisma);