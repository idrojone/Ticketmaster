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

}

export const modelGeneros = new ModelGeneros();