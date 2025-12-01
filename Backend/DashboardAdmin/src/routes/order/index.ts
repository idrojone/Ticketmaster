import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { modelOrder } from "../../models/order";
// @ts-ignore
import fp from 'fastify-plugin';

async function ordersRoutes(server: FastifyInstance) {

    server.route({
        method: 'POST',
        url: '/order',
        // onRequest: [server.authenticate], // Faltaria fer esto
        handler: createOrder
    })
    async function createOrder(request: FastifyRequest, reply: FastifyReply) {
        try {
            console.log('Body recibido:', request.body);
            const newOrder = await modelOrder(server).createOrder(request.body);
            return reply.code(201).send(newOrder);
        } catch (error: any) {
            console.error('Error creando orden:', error);
            return reply.code(500).send({
                success: false,
                message: error.message || 'Error interno del servidor',
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }
}

export default fp(ordersRoutes);


