import { GridFSBucket } from 'mongodb';
import { prisma } from '../plugins/prisma/index';
import { Genero } from '@prisma/client';
import fastify from 'fastify';
import { error } from 'console';
import { fa, no } from 'zod/v4/locales';
import { nextTick } from 'process';
class ModelGeneros {

    constructor(){

    }

    async getAllGeneros(){
        try {
            const generos = await prisma.genero.findMany();
            // console.log('Generos fetched:', generos);
            return generos;
        } catch (error) {
            console.error('Error fetching generos:', error);
            throw error;
        }
    }

    async getGeneroBySlug(slug: string){
        try {
            const genero = await prisma.genero.findUnique({
                where: { slug : slug, }
            });
            return genero;
        } catch (error) {
            console.error('Error fetching genero by slug:', error);
            throw error;
        }
    }

    async createGenero(NuevoGenero: Genero){
        if (!NuevoGenero) {
            return false;
        }

        // Generar updatetAt y createdAt
        const now : Date = new Date();
        NuevoGenero.createdAt = now;
        NuevoGenero.updatedAt = now;

        // Validar que existan slug e id_genero
        if (!NuevoGenero.slug || !NuevoGenero.id_genero) {
            return false;
        }

        // Verificar si el slug ya existe
        const slugExists = await this.checkSlugExists(NuevoGenero.slug as string);
        if (slugExists) {
            console.error('Slug already exists:', NuevoGenero.slug);
            return false;
        }

        // Verificar si el id_genero ya existe
        const idGeneroExists = await this.checkid_generoExists(NuevoGenero.id_genero as string);
        if (idGeneroExists) {
            console.error('id_genero already exists:', NuevoGenero.id_genero);
            return false;
        }

        try {
            const createdGenero = await prisma.genero.create({
                data: NuevoGenero as any,
            });
            return createdGenero;
        } catch (error) {
            console.error('Error creating genero:', error);
            throw error;
        }
    }

    async updateGenero(slug: string, updatedData: Partial<Genero>) {
        // Validar que el género existe
        const genero = await prisma.genero.findUnique({
            where: { slug: slug },
        });

        if (!genero) {
            console.error('Género no encontrado:', slug);
            return false;
        }

        // Actualizar updatedAt
        updatedData.updatedAt = new Date();

        // Si el nombre cambió, generar nuevo slug e id_genero
        if (updatedData.name && updatedData.name !== genero.name) {
            updatedData.slug = await this.generateSlug(updatedData.name);
            updatedData.id_genero = await this.generateSlug(updatedData.name);

            // Validar que el nuevo slug no exista
            const slugExists = await this.checkSlugExists(updatedData.slug);
            if (slugExists) {
            console.error('El slug ya existe:', updatedData.slug);
            return false;
            }

            // Validar que el nuevo id_genero no exista
            const idGeneroExists = await this.checkid_generoExists(updatedData.id_genero);
            if (idGeneroExists) {
            console.error('El id_genero ya existe:', updatedData.id_genero);
            return false;
            }
        }

        // Actualizar el género
        try {
            const updatedGenero = await prisma.genero.update({
            where: { slug: slug },
            data: updatedData,
            });
            return updatedGenero;
        } catch (error) {
            console.error('Error al actualizar el género:', error);
            throw error;
        }
    }


    async generateSlug(name: string){
        return await name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    async generateId(){
        const { v4: uuidv4 } = await import('uuid');
        return uuidv4();
    }

    async checkSlugExists(slug: string){
        try {
            const existingGenero = await prisma.genero.findUnique({
                where: { slug : slug, }
            });
            if (existingGenero) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error checking slug existence:', error);
            throw error;
        }
    }
    
    async checkid_generoExists(id_genero: string){
        try {
            const existingGenero = await prisma.genero.findUnique({
                where: { id_genero : id_genero, }
            });
            if (existingGenero) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error checking id_genero existence:', error);
            throw error;
        }
    }



}

export const modelGeneros = new ModelGeneros();