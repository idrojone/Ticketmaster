import { prisma } from "../plugins/prisma";
import { AuthenticatedUser, LoginRequestBody, RegisterRequestBody, UserAdminWithToken } from "../routes/auth/schema";
import { FastifyInstance, FastifyReply } from "fastify";

class ModelAuth {
    
    private server: FastifyInstance;
    
    constructor(server: FastifyInstance) {
        this.server = server;
    }

    /**
     * Obtiene un usuario (admin o user) por su nombre de usuario
     * @param username Nombre de usuario
     * @returns Usuario encontrado o null si no existe
     */
    async getUserByUsername(username: string) {
        try {
            const admin = await prisma.userAdmin.findUnique({
                where: { username }
            });
            return admin;
        } catch (error) {
            this.server.throwError(500, 'Error fetching user by username', error);
        }
    }

    /**
     * Crea un nuevo usuario administrador
     * @param username Nombre de usuario
     * @param email Correo electrónico
     * @param password Contraseña hasheada
     * @returns Usuario administrador creado
     */
    async createUser(username: string, email: string, password: string) {
        try {
            const admin = await prisma.userAdmin.create({
                data: {
                    username,
                    email,
                    password
                }
            });
            return { ...admin, userType: 'admin' as const };
        } catch (error) {
            this.server.throwError(500, 'Error creating user', error);
        }
    }
    /**
     * Obtiene un usuario administrador por su correo electrónico
     * @param email Correo electrónico
     * @returns Usuario administrador encontrado o null si no existe
     */
    async getUserByEmail(email: string) {
        try {
            const admin = await prisma.userAdmin.findUnique({
                where: { email }
            });
            if (admin) return { ...admin, userType: 'admin' as const };
        } catch (error) {
            this.server.throwError(500, 'Error fetching user by email', error);
        }
    }

    /**
     * Maneja la lógica de inicio de sesión de un usuario administrador
     * @param Body Cuerpo de la solicitud de inicio de sesión
     * @param reply Respuesta Fastify
     * @returns Usuario autenticado con token de acceso
     */
    async onLogin(Body: LoginRequestBody, reply: FastifyReply) {
        const user = await this.getUserByEmail(Body.user.email);

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

        const safeUser: any = { ...user };
        delete safeUser.password;

        const response: AuthenticatedUser = {
            ...safeUser,
            accessToken
        } as AuthenticatedUser;
        return { user: response };
    }

    /**
     * Maneja la lógica de registro de un nuevo usuario administrador
     * @param Body Cuerpo de la solicitud de registro
     * @param reply Respuesta Fastify
     * @returns Nuevo usuario registrado con token de acceso
     */
    async onRegister(Body: RegisterRequestBody, reply: FastifyReply) {

        const user = await this.getUserByUsername(Body.user.username);

        if (user) {
            this.server.throwError(409, 'Username already exists');
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
            }
            this.server.log.error(err);
            this.server.throwError(500, 'Error creating user');
        }
    }

    /**
     * Maneja la obtención de un usuario por su nombre de usuario
     * @param request Solicitud Fastify con parámetros
     * @returns Usuario encontrado sin campos sensibles
     */
    async onGetUser(request: { params: { username?: string } }) {
        const username = request.params?.username;

        if (!username || username === undefined) {
            this.server.throwError(400, 'Se requiere el username');
        }

        const user = await this.getUserByUsername(username);

        if (!user) {
            this.server.throwError(404, 'Usuario no encontrado');
        }

        const safeUser: any = { ...user };
        delete safeUser.password;
        return { user: safeUser };
    }
}

export const modelAuth = (server: FastifyInstance) => new ModelAuth(server);