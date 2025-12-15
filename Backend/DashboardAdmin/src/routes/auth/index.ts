import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { login, register, RegisterRequestBody, LoginRequestBody, get } from './schema';
import { modelAuth } from '../../models/auth';

async function auth (server: FastifyInstance) {   
    /**
     * @route POST /auth/login
     * @description Iniciar sesión de usuario
     * @access Public
     * @returns {Object} 200 - Inicio de sesión exitoso
     * @returns {Object} 400 - Error en la solicitud
     * @returns {Object} 500 - Error del servidor
     * @returns {Object} 401 - Credenciales incorrectas
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

   /**
    * @route POST /auth/register
    * @description Registrar un nuevo usuario
    * @access Public / Para desarrollo, en producción NO exsiste este endpoint
    * @returns {Object} 201 - Usuario registrado exitosamente
    * @returns {Object} 400 - Error en la solicitud
    * @returns {Object} 500 - Error del servidor
    * @returns {Object} 409 - Conflicto (usuario ya existe)
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


    /**
     * @route GET /auth/user/:username
     * @description Obtener un usuario por su nombre de usuario
     * @access Private (Requiere autenticación y rol)
     * @returns {Object} 200 - Usuario encontrado
     * @returns {Object} 404 - Usuario no encontrado
     * @returns {Object} 500 - Error del servidor
     * @returns {Object} 401 - No autorizado
     * @returns {Object} 400 - Solicitud incorrecta
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