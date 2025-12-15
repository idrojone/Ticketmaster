import fastify from 'fastify';
import startServer from './src/server';
import config from './src/config';

const main = async () => {
    //Control de errores no manejados
    process.on('unhandledRejection', (error: Error) => {
        console.error('Unhandled Rejection:', error);
        process.exit(1);
    });

    const configuracion = await config.getConfig();

    //Iniciamos el servidor
    try {
        const server = fastify({
            bodyLimit: 1048576,
        });
        await server.register(startServer, configuracion);

        // Prefer fastify Env options loaded via plugin, fallback to process.env
        const serverOptionsEnv = (server as any).optionsEnv ?? process.env;
        if (!(server as any).optionsEnv) {
            // fastify-env plugin did not populate optionsEnv; log a warning and use process.env fallback
            console.warn('[WARN] fastify-env plugin did not load, falling back to process.env for configuration.');
        }
        const port = Number(serverOptionsEnv.API_PORT ?? process.env.API_PORT ?? 3010);
        const host = serverOptionsEnv.API_HOST ?? process.env.API_HOST ?? '0.0.0.0';

        //Log de la dirección del servidor
        await server.listen({ port, host });

        console.log(`[INFO] Server started on ${host}:${port}`);

        server.ready(err => {
            if (err) throw err;
            console.log(server.printRoutes());
        });

        // console.log(typeof FastifyInstance);
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

main();