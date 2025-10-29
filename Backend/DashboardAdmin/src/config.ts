async function getConfig() {
    
    // Schema de validación
    const schema = {
        type: 'object',
        required: ['API_HOST', 'API_PORT', 'API_PREFIX'],
        properties: {
            API_HOST: { type: 'string' },
            API_PORT: { type: 'number' },
            API_PREFIX: { type: 'string'},
        },
    };

    // Opciones de fastify-env
    const optionsEnv = {
        confKey: 'config',
        dotenv: true,
        data: process.env,
        schema: schema, 
    };

    // Configuración del servidor
    const config = {
        prefix: process.env.API_PREFIX,
        fastify: {
            host: process.env.API_HOST,
            port: parseInt(process.env.API_PORT || '3000')
        },
        fastifyInit: {
            logger: {
                level: process.env.LOG_LEVEL || 'info',
                serializers: {
                    req: (request : any) => ({
                        method: request.raw.method,
                        url: request.raw.url,
                        hostname: request.hostname
                    }),
                    res: (response : any) => ({
                        statusCode: response.statusCode
                    })
                }
            }
        }
    };

    return { optionsEnv, config };
}

// export { getConfig };
export default { getConfig };