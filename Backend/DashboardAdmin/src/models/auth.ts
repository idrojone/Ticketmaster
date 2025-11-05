import { prisma } from "../plugins/prisma";

class ModelAuth {
    constructor() {}

    async getUserByUsername(username: string) {
        // Primero busca en UserAdmin
        const admin = await prisma.userAdmin.findUnique({
            where: { username }
        });

        if (admin) {
            return { ...admin, userType: 'admin' as const };
        }

        // Si no encuentra, busca en User
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (user) {
            return { ...user, userType: 'user' as const };
        }

        return null;
    }

    async createUser(username: string, email: string, password: string) {
        const admin = await prisma.userAdmin.create({
            data: {
                username,
                email,
                password
            }
        });
        return { ...admin, userType: 'admin' as const };
    }

    async getUserByEmail(email: string) {
        const admin = await prisma.userAdmin.findUnique({
            where: { email }
        });
        if (admin) {
            return { ...admin, userType: 'admin' as const };
        }
        return null;
    }
}

export const modelAuth = new ModelAuth();