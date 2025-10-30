import { prisma } from '../plugins/prisma/index';

class ModelGeneros {

    constructor(){

    }

    async getAllGeneros(){
        return await prisma.genero.findMany();
    }

}

export const modelGeneros = new ModelGeneros();