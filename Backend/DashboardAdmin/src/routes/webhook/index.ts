import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../plugins/prisma";

async function webhookRoutes(server: FastifyInstance) {

    server.addContentTypeParser('application/json', { parseAs: 'buffer' }, function (req, body, done) {
        done(null, body);
    });

    server.post('', webhookHandler);

    async function webhookHandler(request: FastifyRequest, reply: FastifyReply) {
        const sig = request.headers['stripe-signature'] as string;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error('STRIPE_WEBHOOK_SECRET is not defined');
            return reply.status(500).send('Webhook Secret not configured');
        }

        let event;

        try {
            event = server.stripe.webhooks.constructEvent(request.body as Buffer, sig, webhookSecret);
        } catch (err: any) {
            console.error('Webhook signature verification failed.', err.message);
            return reply.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'payment_intent.succeeded') {
            const pi = event.data.object as any;
            const transactionRef = pi.id;
            const orderId = pi.metadata?.orderId;

            console.log(`Processing payment_intent.succeeded for order ${orderId}`);

            try {
                await prisma.$transaction(async (tx) => {
                    //Buscar pago existente por transactionRef
                    let payment = await tx.payment.findFirst({
                        where: { transactionRef }
                    });

                    let finalOrderId: string;

                    if (!payment) {
                        // Si no existe el payment, necesitamos el orderId del metadata
                        if (!orderId) {
                            throw new Error('Payment not found and orderId missing in metadata');
                        }
                        
                        // Crear el payment
                        payment = await tx.payment.create({
                            data: {
                                orderId: orderId,
                                amount: (pi.amount_received || pi.amount) / 100,
                                method: 'Stripe',
                                transactionRef,
                                currency: pi.currency,
                                status: 'COMPLETED',
                                paidAt: new Date(),
                            }
                        });
                        finalOrderId = orderId;
                    } else {
                        // Si existe, actualizamos el estado
                        await tx.payment.update({
                            where: { id: payment.id },
                            data: {
                                status: 'COMPLETED',
                                paidAt: new Date()
                            }
                        });
                        finalOrderId = payment.orderId;
                    }

                    // 2. Cargar orden
                    const order = await tx.order.findUnique({
                        where: { id: finalOrderId }
                    });

                    if (!order) throw new Error(`Order ${finalOrderId} not found`);

                    for (const item of order.conciertos) {
                        const concierto = await tx.concierto.findUnique({ where: { id: item.conciertoId } });

                        if (!concierto) throw new Error(`Concierto ${item.conciertoId} not found`);
                        if (concierto.aforo < item.cantidad) {
                            throw new Error(`Stock insuficiente para concierto ${concierto.nombre}`);
                        }

                        await tx.concierto.update({
                            where: { id: concierto.id },
                            data: { aforo: { decrement: item.cantidad } }
                        });

                        // Generar entradas
                        for (let i = 0; i < item.cantidad; i++) {
                            await tx.entrada.create({
                                data: {
                                    userId: order.userId,
                                    conciertoId: concierto.id,
                                    tipo: 'GENERAL',
                                    precio_compra: concierto.precio,
                                    status: 'ACCEPTED'
                                }
                            });
                        }
                    }

                    // 4. Verificar stock para Merchandising
                    for (const item of order.merchandising) {
                        const merch = await tx.merchandising.findUnique({ where: { id: item.merchandisingId } });

                        if (!merch) throw new Error(`Merchandising ${item.merchandisingId} not found`);
                        if (merch.stock < item.cantidad) {
                            throw new Error(`Stock insuficiente para merchandising ${merch.nombre}`);
                        }

                        // Decrementar stock
                        await tx.merchandising.update({
                            where: { id: merch.id },
                            data: { stock: { decrement: item.cantidad } }
                        });
                    }

                    // 5. Marcar orden como PAID
                    await tx.order.update({
                        where: { id: order.id },
                        data: {
                            status: 'PAID'
                        }
                    });

                    await tx.carrito.update({
                        where: { id: order.carritoId },
                        data: {
                            status: 'ACCEPTED',
                            is_active: false
                        }
                    });
                });

                console.log(`Orden ${orderId} completada correctamente`);
                return reply.send({ received: true });

            } catch (err) {
                console.error('Error procesando webhook:', err);
                return reply.status(500).send(`Error processing webhook: ${err}`);
            }
        }

        return reply.send({ received: true });
    }
}

export default webhookRoutes;
