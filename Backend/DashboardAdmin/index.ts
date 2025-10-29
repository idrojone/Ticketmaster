import config from './src/config';
import startServer from './src/server';
import fastify from 'fastify';

const main = async () => {
    //Control de errores no manejados
    process.on('unhandledRejection', (error : Error) => {
        console.error('Unhandled Rejection:', error);
        process.exit(1);
    });

    const configuracion = await config.getConfig();

    //Iniciamos el servidor
    try {
        const server = fastify();
        await server.register(startServer, configuracion);

        const port= (server as any).config.API_PORT;
        const host= (server as any).config.API_HOST;

        //Log de la dirección del servidor
        const address = await server.listen({port, host});

        console.log(`[INFO]  Server started on `+host+':'+port);
        
    }catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

main();