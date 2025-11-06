import { prisma } from '../plugins/prisma/index';
import { Genero, PrismaClient } from '@prisma/client';

class ModelGeneros {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    async getAllGeneros(){
        try {
            return await this.prisma.genero.findMany();
        } catch (error) {
            console.error('Error fetching generos:', error);
            throw error;
        }
    }

    async getGeneroBySlug(slug: string){
        try {
            return await this.prisma.genero.findUnique({
                where: { slug : slug, }
            });
        } catch (error) {
            console.error('Error fetching genero by slug:', error);
            throw error;
        }
    }

    async createGenero(NuevoGenero: Genero) {
        try {
            return await this.prisma.genero.create({
                data: NuevoGenero,
            });
        } catch (error) {
            console.error('Error creating genero:', error);
            throw error;
        }
    }

    async updateConciertosGeneroId(oldIdGenero: string, newIdGenero: string) {
        try {
            return await this.prisma.concierto.updateMany({
                where: { id_genero: oldIdGenero },
                data: { id_genero: newIdGenero },
            });
        } catch (error) {
            console.error('Error updating conciertos with new id_genero:', error);
            throw error;
        }
    }

    async updateGenero(slug: string, updatedData: Partial<Genero>) {
        try {
            return await this.prisma.genero.update({
                where: { slug: slug },
                data: updatedData,
            });
        } catch (error) {
            console.error('Error al actualizar el género:', error);
            throw error;
        }
    }

    async checkSlugExists(slug: string){
        try {
            return await this.prisma.genero.findUnique({
                where: { slug : slug, }
            });
        } catch (error) {
            console.error('Error checking slug existence:', error);
            throw error;
        }
    }
    
    async checkid_generoExists(id_genero: string){
        try {
            return await this.prisma.genero.findUnique({
                where: { id_genero : id_genero, }
            });
        } catch (error) {
            console.error('Error checking id_genero existence:', error);
            throw error;
        }
    }

    async getGeneroById(id_genero: string){
        try {
            this.checkid_generoExists(id_genero);
            return await this.prisma.genero.findUnique({
                where: { id_genero : id_genero, }
            });
        } catch (error) {
            console.error('Error fetching genero by id_genero:', error);
            throw error;
        }
    }
}

export const modelGeneros = new ModelGeneros(prisma);