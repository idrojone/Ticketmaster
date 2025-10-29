const fastify = require('fastify');
const conciertosModel = require('../../../models/conciertos.model');
const conciertosController = require('../../../controllers/conciertos.controller');

async function concertRoutes (server: any, options: any) {

    server.get('/conciertos', async (request: any, reply: any) => {
        
    });

}

module.exports = concertRoutes;