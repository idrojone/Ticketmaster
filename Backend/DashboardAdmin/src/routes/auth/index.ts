import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { login, register, RegisterRequestBody, LoginRequestBody, get } from './schema';
import { modelAuth } from '../../models/auth';

async function auth (server: FastifyInstance) {   
    /* 
        User Login 
    */
    server.route({
        method: 'POST',
        url: '/auth/login',
        schema: login,
        handler: onLogin
    });
    async function onLogin(request: FastifyRequest<{ Body: LoginRequestBody }>, reply: FastifyReply) {
        const result = await modelAuth(server).onLogin(request.body, reply);
        return reply.code(200).send(result);
    }

    /* 
        User Register
    */
    server.route({
        method: 'POST',
        url: '/auth/register',
        schema: register,
        handler: onRegister
    });
    async function onRegister(request: FastifyRequest<{ Body: RegisterRequestBody }>, reply: FastifyReply) {
        const result = await modelAuth(server).onRegister(request.body, reply);
        return reply.code(201).send(result);
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
    });
    async function onGetUser(request: FastifyRequest<{ Params: { username?: string } }>, reply: FastifyReply) {
        const result = await modelAuth(server).onGetUser({ params: request.params });
        return reply.code(200).send(result);
    }

}

export default fp(auth);