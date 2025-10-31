import { prisma } from "../plugins/prisma";

class ModelAuth {
    constructor() {}

    async getUserByUsername(username: string) {
        return await prisma.userAdmin.findUnique({
            where: { username }
        });
    }

    async createUser(username: string, email: string, password: string) {
        return await prisma.userAdmin.create({
            data: {
                username,
                email,
                password
            }
        });
    }
}

export const modelAuth = new ModelAuth();