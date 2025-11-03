import { prisma } from '../plugins/prisma/index';

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

    async createGenero(NuevoGenero: Object){
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

    async generateSlug(name: string){
        return await name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    async generateId(){
        const { v4: uuidv4 } = await import('uuid');
        return uuidv4();
    }

}

export const modelGeneros = new ModelGeneros();