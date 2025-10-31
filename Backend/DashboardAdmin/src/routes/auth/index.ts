import fp from 'fastify-plugin'
import fastify, { FastifyInstance, FastifyReply } from 'fastify'
import { login, register } from './schema';
import { modelAuth } from '../../models/auth';




async function auth (server: FastifyInstance, options: Record<string, any>) {   
    async function createAccessToken(username: string, reply: FastifyReply) {
        return await reply.jwtSign(
            {username: username},
            {expiresIn: '12h'}
        )
    }
    // console.log(server);

    /* 
        User Login 
    */
    server.route({
        method: 'POST',
        url: options.prefix + 'login',
        schema: login,
        handler: onLogin
    })
    async function onLogin(request: any, reply: any) {

        /* Comprobación de usuario */
        const user = await modelAuth.getUserByUsername(request.body.user.username);

        if (!user) return reply.code(401).send({ message: 'Usuario no encontrado' });

        /* Comprobación de status */
        if (user.status !== 'ACCEPTED') {
            return reply.code(403).send({ message: 'El usuario no está permitido' });
        }
        /* Comprobación de contraseña */
        if (await server.hashCompare(request.body.user.password, user.password)) {
            console.log("Contraseña correcta");
            user.accessToken = await createAccessToken(user.username, reply);
            return { user };
        }
        
        return reply.code(401).send({ message: 'Invalid username or password' });
    }

    /* 
        User Register
    */
    server.route({
        method: 'POST',
        url: options.prefix + 'register',
        schema: register,
        handler: onRegister
    })
    async function onRegister(request: any, reply: any) {
        /* Comprobación de usuario */
        const user = await modelAuth.getUserByUsername(request.body.user.username);

        if (user) return reply.code(409).send({ message: 'Username already exists' });

        /* Registro de usuario */
        const hashedPassword = await server.hash(request.body.user.password);
        const newUser = await modelAuth.createUser(request.body.user.username, request.body.user.email, hashedPassword);
        newUser.accessToken = await createAccessToken(newUser.username, reply);
        return { user: newUser };
    }

}

export default fp(auth);