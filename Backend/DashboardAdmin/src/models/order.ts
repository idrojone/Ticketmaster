import { FastifyInstance } from "fastify";
import { prisma } from "../plugins/prisma";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';


class ModelOrder {
    private server: FastifyInstance;

    constructor(server: FastifyInstance) {
        this.server = server;
    }

    async createOrder(request: any) {
        const { cartId } = request;

        if (!cartId) {
            throw new Error('cartId es requerido');
        }

        const cart = await prisma.carrito.findUnique({
            where: {
                id: cartId
            }
        });

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const paymentIntentIdempotencyKey = `pi-request-${uuidv4()}`;
        const amountInCents = Math.round(cart.precio * 100);
        const currency = 'eur';

        const paymentIntent = await this.server.stripe.paymentIntents.create(
            {
                amount: amountInCents,
                currency: currency,
                metadata: {
                    cartId: cart.id,
                    userId: cart.userId
                },
                automatic_payment_methods: {
                    enabled: true,
                },
            },
            { idempotencyKey: paymentIntentIdempotencyKey }
        );

        const result = await prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    userId: cart.userId,
                    carritoId: cart.id,
                    totalAmount: cart.precio,
                    status: 'PENDING',
                    conciertos: cart.conciertos,
                    merchandising: cart.merchandising,
                }
            });

            const payment = await tx.payment.create({
                data: {
                    orderId: order.id,
                    method: 'Stripe', 
                    amount: cart.precio,
                    currency: currency,
                    transactionRef: paymentIntent.id,
                    status: 'PENDING'
                }
            });

            return { order, payment };
        });

        try {
            await this.server.stripe.paymentIntents.update(paymentIntent.id, { 
                metadata: { orderId: result.order.id } 
            });
        } catch (stripeError) {
            console.error('No se pudo actualizar metadata de PaymentIntent:', stripeError);
        }

        return {
            order: result.order,
            payment: result.payment,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        };
    }

}

export const modelOrder = (server: FastifyInstance) => new ModelOrder(server);

