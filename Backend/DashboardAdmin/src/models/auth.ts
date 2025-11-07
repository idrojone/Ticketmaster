import { prisma } from "../plugins/prisma";
import { AuthenticatedUser, LoginRequestBody, RegisterRequestBody, UserAdminWithToken } from "../routes/auth/schema";
import { FastifyInstance, FastifyReply } from "fastify";

class ModelAuth {
    
    private server: FastifyInstance;
    
    constructor(server: FastifyInstance) {
        this.server = server;
    }

    async getUserByUsername(username: string) {
        const admin = await prisma.userAdmin.findUnique({
            where: { username }
        });

        if (admin) {
            return { ...admin, userType: 'admin' as const };
        }

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

    async onLogin(Body: LoginRequestBody, reply: FastifyReply) {
        const user = await this.getUserByEmail(Body.user.email);

        // No revelar si el usuario existe: devolver error genérico de credenciales
        if (!user) {
            this.server.throwError(401, 'Credenciales incorrectas');
            return;
        }

        if (user.status !== 'ACCEPTED') {
            this.server.throwError(403, 'Usuario no permitido');
            return;
        }

        const isValid = await this.server.hashCompare(Body.user.password, user.password);
        if (!isValid) {
            this.server.throwError(401, 'Credenciales incorrectas');
            return;
        }

        const accessToken = await this.server.generateAccessToken(user.username, reply);

        // Eliminar campos sensibles antes de devolver
        const safeUser: any = { ...user };
        delete safeUser.password;

        const response: AuthenticatedUser = {
            ...safeUser,
            accessToken
        } as AuthenticatedUser;
        return { user: response };
    }

    
    async onRegister(Body: RegisterRequestBody, reply: FastifyReply) {

        const user = await this.getUserByUsername(Body.user.username);

        if (user) {
            this.server.throwError(409, 'Username already exists');
            return;
        }

        const hashedPassword = await this.server.hash(Body.user.password);
        try {
            const newUser = await this.createUser(Body.user.username, Body.user.email, hashedPassword);
            const accessToken = await this.server.generateAccessToken(newUser.username, reply);

            const safeUser: any = { ...newUser };
            delete safeUser.password;

            const response: UserAdminWithToken = {
                ...safeUser,
                accessToken
            } as UserAdminWithToken;

            return { user: response };
        } catch (err: any) {
            if (err?.code === 'P2002') {
                this.server.throwError(409, 'Username or email already exists');
                return;
            }
            this.server.log.error(err);
            this.server.throwError(500, 'Error creating user');
            return;
        }
    }

    async onGetUser(request: { params: { username?: string } }) {
        const username = request.params?.username;

        if (!username || username === undefined) {
            this.server.throwError(400, 'Se requiere el username');
            return;
        }

        const user = await this.getUserByUsername(username);

        if (!user) {
            this.server.throwError(404, 'Usuario no encontrado');
            return;
        }

        const safeUser: any = { ...user };
        delete safeUser.password;
        return { user: safeUser };
    }


}

export const modelAuth = (server: FastifyInstance) => new ModelAuth(server);