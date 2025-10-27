const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function conciertosRoutes(fastify) {

    fastify.get('/conciertos', async (request, reply) => {
        const conciertos = await prisma.conciertos.findMany();
        reply.send(conciertos);
    });


}

module.exports = conciertosRoutes;
