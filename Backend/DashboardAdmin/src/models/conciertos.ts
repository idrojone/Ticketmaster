import { Concierto } from "@prisma/client";
import { prisma } from "../plugins/prisma";

class ModelConciertos {

    private static instance: ModelConciertos;

    public static getInstance() {
        if (!ModelConciertos.instance) {
            ModelConciertos.instance = new ModelConciertos();
        }
        return ModelConciertos.instance;
    }
    
    /**
     * Obtener todos los conciertos
     * @returns  {Promise<Concierto[]>}
     */
    async getAllConciertos() {
        try {
            const conciertos = await prisma.concierto.findMany();
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
    async createConcierto(conciertoData: any) {
        try {
            const newConcierto = await prisma.concierto.create({
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
            const concierto = await prisma.concierto.findUnique({
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
    async updateConcierto(slug: string, updateData: any) {
        try {
            const updatedConcierto = await prisma.concierto.update({
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
     * Eliminar un concierto por slug
     * @param {string} slug - Slug del concierto a eliminar
     * @returns {Promise<Concierto>}
     */
    async deleteConcierto(slug: string) {
        try {
            const deletedConcierto = await prisma.concierto.delete({
                where: { slug }
            });
            return deletedConcierto;
        } catch (error) {
            console.error('Error deleting concierto:', error);
            throw error;
        }
    }
}

export const modelConciertos = new ModelConciertos();