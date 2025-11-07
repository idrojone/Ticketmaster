import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import * as argon2 from 'argon2';

export default fp(async (server: FastifyInstance) => {
    try {
        server.decorate('hash', async function (password: string) {
            return await argon2.hash(password);
        });

        server.decorate('hashCompare', async function (hashedPassword: string, plainPassword: string) {
            return await argon2.verify(plainPassword, hashedPassword);
        });

    } catch (error) {
        console.error('Error initializing Argon2 plugin:', error);
    }
});

