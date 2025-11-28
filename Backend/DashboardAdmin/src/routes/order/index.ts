import { Order } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { modelOrder } from "../../models/order";
import fp from 'fastify-plugin';

async function ordersRoutes(server: FastifyInstance) {

    server.route({
        method: 'POST',
        url: '/order',
        // onRequest: [server.authenticate], // Faltaria fer esto
        handler: createOrder
    })
    async function createOrder(request: FastifyRequest, reply: FastifyReply) {
        const newOrder = await modelOrder(server).createOrder(request.body);
        return reply.code(201).send(newOrder);
    }
}

export default fp(ordersRoutes);


