const env = require('dotenv');
env.config(); // Carga las variables de entorno desde el archivo .env

async function getConfig() {
    
    // Schema de validación
    /* IMPORTANTE !!!!!
        Si añades .env variables nuevas, debes añadirlas también al schema de validación
    */
    const schema = {
        type: 'object',
        required: ['API_HOST', 'API_PORT', 'API_PREFIX', 'JWT_SECRET', 'JWT_EXPIRES_IN'],
        properties: {
            API_HOST: { type: 'string' },
            API_PORT: { type: 'number' },
            API_PREFIX: { type: 'string'},
            JWT_SECRET: { type: 'string' }, 
            JWT_EXPIRES_IN: { type: 'string' }
        },
    };

    // Opciones de fastify-env
    const optionsEnv = {
        confKey: 'optionsEnv', // clave para acceder a las variables de entorno
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
