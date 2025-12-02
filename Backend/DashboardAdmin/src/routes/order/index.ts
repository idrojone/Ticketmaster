import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { modelOrder } from "../../models/order";
// @ts-ignore
import fp from 'fastify-plugin';

async function ordersRoutes(server: FastifyInstance) {

    server.route({
        method: 'POST',
        url: '/order',
        onRequest: [server.authenticateServer],
        handler: createOrder
    })
    async function createOrder(request: FastifyRequest, reply: FastifyReply) {
        try {
            console.log('Body recibido:', request.body);
            const cartId = (request.body as any)?.cartId;
            const token = (request as any).user; 
            const newOrder = await modelOrder(server).createOrder({ cartId, token });
            return reply.code(201).send({ success: true, ...newOrder });
        } catch (error: any) {
            console.error('Error creando orden:', error);
            return reply.code(500).send({
                success: false,
                message: error.message || 'Error interno del servidor',
            });
        }
    }
}

export default fp(ordersRoutes);


