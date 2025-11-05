import { prisma } from "../plugins/prisma";
import slugify from 'slugify';

class ModelConciertos {

    private static instance: ModelConciertos;

    public static getInstance() {
        if (!ModelConciertos.instance) {
            ModelConciertos.instance = new ModelConciertos();
        }
        return ModelConciertos.instance;
    }
    
    async getAllConciertos() {
        try {
            const conciertos = await prisma.concierto.findMany();
            return conciertos;
        } catch (error) {
            console.error('Error fetching conciertos:', error);
            throw error;
        }
    }

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
}

export const modelConciertos = new ModelConciertos();