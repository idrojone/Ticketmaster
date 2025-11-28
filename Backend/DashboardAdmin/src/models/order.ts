import fastify, { FastifyInstance } from "fastify";
import { prisma } from "../plugins/prisma";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

class ModelOrder {
    private prisma: PrismaClient;
    private server: FastifyInstance;

    constructor(prismaClient: PrismaClient, server: FastifyInstance) {
        this.prisma = prismaClient;
        this.server = server;
    }

    async createOrder(request: any) {
        const { cartId } = request;

        const cart = await this.prisma.carrito.findUnique({
            where: {
                id: cartId
            }
        });

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const paymentIntentIdempotencyKey = `pi-request-${uuidv4()}`;

        const order = await this.prisma.$transaction(async tx => {
            const order = await tx.order.create({
                data: {
                    carritoId: cartId,
                    userId: cart.userId,
                    total: cart.precio,
                    status: 'PENDING'
                }
            });

            await tx.pagos.create({
                data: {
                    orderId: order.id,
                    metodo: 'Stripe',
                    monto: cart.precio,
                    status: 'PENDING'
                }
            });

            return order;
        });

        try {
            const paymentIntent = await this.server.stripe.paymentIntents.create(
                {
                    amount: Math.round(cart.precio * 100), // Convertir a céntimos
                    currency: 'eur',
                    metadata: {
                        orderId: order.id
                    }
                },
                { idempotencyKey: paymentIntentIdempotencyKey }
            );

            return {
                order,
                paymentIntent
            };
        } catch (error) {
            await this.prisma.order.update({
                where: { id: order.id },
                data: { status: 'REJECTED' }
            });
            throw error;
        }
    }

}

export const modelOrder = (server: FastifyInstance) => new ModelOrder(prisma, server);

