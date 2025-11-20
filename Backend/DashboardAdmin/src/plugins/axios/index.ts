import fp from 'fastify-plugin';  
import axios from 'axios';
import axiosRetry from 'axios-retry';

export default fp(async (server) => {
    const axiosClient = axios.create({
        baseURL: 'http://localhost:3030', // URL base del API Gateway de NestJS
        timeout: 5000, // Tiempo de espera de 5 segundos
    });

    axiosRetry(axiosClient, {
        retries: 3, // Número de reintentos
        retryDelay: axiosRetry.exponentialDelay, // Retraso exponencial entre reintentos
        retryCondition: axiosRetry.isNetworkOrIdempotentRequestError, // Reintentar en errores de red o solicitudes idempotentes
    });

    server.decorate('axiosClient', axiosClient);
});



