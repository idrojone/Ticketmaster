import fp from 'fastify-plugin'
import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { login, register, RegisterRequestBody, LoginRequestBody, UserAdminWithToken, AuthenticatedUser, get } from './schema';
import { modelAuth } from '../../models/auth';

async function auth (server: FastifyInstance, options: Record<string, any>) {   
    /* 
        User Login 
    */
    server.route({
        method: 'POST',
        url: '/auth/login',
        schema: login,
        handler: onLogin
    })
    async function onLogin(request: FastifyRequest<{ Body: LoginRequestBody }>, reply: FastifyReply) {

        /* Comprobación de usuario */
        const user = await modelAuth.getUserByEmail(request.body.user.email);

        if (!user) return reply.code(401).send({ message: 'Usuario no encontrado' });

        /* Comprobación de status */
        if (user.status !== 'ACCEPTED') {
            server.throwError(403, 'El usuario no está permitido');
        }
        /* Comprobación de contraseña */
        if (await server.hashCompare(request.body.user.password, user.password)) {
            console.log("Contraseña correcta");
            const accessToken = await server.generateAccessToken(user.username, reply);
            
            // Crear respuesta tipada
            const response: AuthenticatedUser = {
                ...user,
                accessToken
            } as AuthenticatedUser;
            
            return { user: response };
        }
        
        // return reply.code(401).send({ message: 'Invalid username or password' });
        server.throwError(401, 'Usuario o contraseña incorrectos');
    }

    /* 
        User Register
    */
    server.route({
        method: 'POST',
        url: '/auth/register',
        schema: register,
        handler: onRegister
    })
    async function onRegister(request: FastifyRequest<{ Body: RegisterRequestBody }>, reply: FastifyReply) {
        /* Comprobación de usuario */
        const user = await modelAuth.getUserByUsername(request.body.user.username);

        if (user) return reply.code(409).send({ message: 'Username already exists' });

        /* Registro de usuario */
        const hashedPassword = await server.hash(request.body.user.password);
        const newUser = await modelAuth.createUser(request.body.user.username, request.body.user.email, hashedPassword);
        const accessToken = await server.generateAccessToken(newUser.username, reply);
        
        const response: UserAdminWithToken = {
            ...newUser,
            accessToken
        } as UserAdminWithToken;
        
        return { user: response };
    }


    /* 
        User Get
    */
    server.route({
        method: 'GET',
        url: '/auth/user/:username',
        onRequest: [server.authenticate, server.authenticateRole],
        schema: get,
        handler: onGetUser
    })
    async function onGetUser(request: FastifyRequest<{ Params: { username?: string } }>, reply: FastifyReply) {
        const username = request.params?.username;

        if (!username || username === undefined) return reply.code(400).send({ message: 'Se requiere el username' });

        const user = await modelAuth.getUserByUsername(username);

        if (!user) server.throwError(404, 'Usuario no encontrado');

        return { user };
    }

}

export default fp(auth);