import fp from 'fastify-plugin';
import Stripe from 'stripe';
import { FastifyInstance } from 'fastify';


async function stripePlugin(server: FastifyInstance) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
        server.log.error('STRIPE_SECRET_KEY is not defined in environment variables');
        throw new Error('STRIPE_SECRET_KEY is required');
    }

    const stripe = new Stripe(stripeSecretKey, {
        typescript: true,
    });

    server.decorate('stripe', stripe);

}

export default fp(stripePlugin, {
    name: 'stripe',
});

