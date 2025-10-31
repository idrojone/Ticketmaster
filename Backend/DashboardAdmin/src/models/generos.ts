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

}

export const modelGeneros = new ModelGeneros();