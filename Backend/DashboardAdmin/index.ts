import fastify from 'fastify';
import startServer from './src/server';
import config from './src/config';

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

        const port= (server as any).optionsEnv.API_PORT;
        const host= (server as any).optionsEnv.API_HOST;

        //Log de la dirección del servidor
    await server.listen({ port, host });

    console.log(`[INFO] Server started on ${host}:${port}`);
        
       server.ready(err => {
        if (err) throw err;
        console.log(server.printRoutes());
       });

        // console.log(typeof FastifyInstance);
    }catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

main();