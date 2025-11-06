import fp from 'fastify-plugin';

export default fp(async (fastify) => {
    
    fastify.setErrorHandler((error, request, reply) => {
        
        fastify.log.error(error);

        const statusCode = error.statusCode || 500;
        const message = error.message || 'Error interno del servidor';

        reply.status(statusCode).send({
            error: {
                code: statusCode,
                message: message
            }
        });
    });

    fastify.decorate('throwError', (statusCode: number, message: string) => {
        const error = new Error(message);
        (error as any).statusCode = statusCode;
        throw error;
    });

    

})