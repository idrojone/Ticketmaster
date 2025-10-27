const getConfig = require('./src/config/config.ts');
const startServer = require('./src/server.ts');
const fastify = require('fastify');

const main = async () => {
    //Control de errores no manejados
    process.on('unhandledRejection', (error : Error) => {
        console.error('Unhandled Rejection:', error);
        process.exit(1);
    });

    //Importamos la configuración
    const config = await getConfig();

    //Iniciamos el servidor
    try {
        const server = fastify();
        server.register(startServer, config);

        //Log de la dirección del servidor
        const address = await server.listen(config.fastify)
    }catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
}

main();