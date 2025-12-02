import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../plugins/prisma";

async function webhookRoutes(server: FastifyInstance) {

    // Register a custom content type parser for this route only
    // This preserves the raw body needed for Stripe signature verification
    server.removeContentTypeParser('application/json');
    server.addContentTypeParser('application/json', { parseAs: 'buffer' }, function (req, body: Buffer, done) {
        done(null, body);
    });

    server.post('', webhookHandler);

    async function webhookHandler(request: FastifyRequest, reply: FastifyReply) {
        const sig = (request.headers['stripe-signature'] || request.headers['Stripe-Signature']) as string;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        // Safety check: ensure stripe plugin is available
        if (!server.stripe) {
            console.error('Stripe client not configured on server');
            return reply.status(500).send({ error: 'Server misconfiguration' });
        }

        if (!webhookSecret) {
            console.error('STRIPE_WEBHOOK_SECRET is not defined');
            return reply.status(500).send('Webhook Secret not configured');
        }

        let event;

        try {
            // rawBody expected to be Buffer due to custom content-type parser
            const rawBody = request.body as Buffer | string | undefined;
            if (!rawBody) {
                console.error('Webhook: empty body received');
                return reply.status(400).send({ error: 'Empty body' });
            }
            console.log('Webhook: body length:', Buffer.isBuffer(rawBody) ? rawBody.length : String(rawBody).length);
            // If signature header missing, return 400 (bad request)
            if (!sig) {
                console.error('Webhook signature header missing');
                return reply.status(400).send({ error: 'Missing stripe-signature header' });
            }
            try {
                event = server.stripe.webhooks.constructEvent(rawBody as Buffer, sig, webhookSecret);
            } catch (err: any) {
                console.error('Webhook signature verification failed:', err?.message || err);
                // Log the raw request body for safe debugging (truncate to avoid huge logs)
                try {
                    const snippet = (Buffer.isBuffer(rawBody) ? rawBody.toString('utf8') : String(rawBody)).slice(0, 4000);
                    console.error('Webhook raw body snippet:', snippet);
                } catch (e) {
                    console.error('Error while logging raw body snippet', e);
                }
                return reply.status(400).send({ error: `Webhook signature verification failed` });
            }
        } catch (err: any) {
            console.error('Webhook handler unexpected error while parsing body:', err?.message || err);
            return reply.status(500).send({ error: 'Unexpected error' });
        }

        console.log('Webhook event received:', event.type, event.id);

        if (event.type === 'payment_intent.succeeded') {
            const pi = event.data.object as any;
            const transactionRef = pi.id;
            const orderId = pi.metadata?.orderId;

            console.log(orderId, transactionRef)

            try {
                // Wrap DB processing in a transaction and catch any DB errors
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
                    console.log(`Carrito ${order.carritoId} actualizado correctamente`);
                });

                console.log(`Orden ${orderId} completada correctamente`);
                return reply.code(200).send({ received: true });

            } catch (err: any) {
                console.error('Error procesando webhook:', err?.message || err);
                return reply.status(500).send({ error: 'Error processing webhook', details: err?.message || String(err) });
            }
        }
        console.log('Webhook: unhandled event type:', event.type);
        return reply.code(200).send({ received: true, msg: 'Unhandled event type' });
    }
}

export default webhookRoutes;
