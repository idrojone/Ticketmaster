import * as path from 'path'
import fp from 'fastify-plugin'
import autoLoad from '@fastify/autoload'
import cors from '@fastify/cors'
import { FastifyInstance } from 'fastify'
import { fastifyEnv } from '@fastify/env'
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

// https://github.com/fastify/fastify-env


/**
 * Configure and starts Fastify server with all required plugins and routes
 * @async
 * @param {Fastify.Server} server - Fastify server instance
 * @param {Object} config - optional configuration options (default to ./config module)
 *                          May contain a key per plugin (key is plugin name), and an extra
 *                          'fastify' key containing the server configuration object
 * @returns {Fastify.Server} started Fastify server instance
 */

async function plugin (server: FastifyInstance, configuracion: Record<string, any>) {
  const { optionsEnv, config } = configuracion;
  // console.log("Iniciando servidor con configuración:", configuracion);
  await server

    /* EL CORS */
    .register(cors, {})
    .after(err => {
      if (err) console.error('Error al registrar CORS:', err);
    })

    /* Cargar las variables de entorno */
    .register(fastifyEnv, optionsEnv)
    .after(err => {
      if (err) console.error('Error al cargar variables de entorno:', err);
    })
    
    /* Cargar los plugins */
    .register(autoLoad, {
      dir: path.join(__dirname, 'plugins'),
      options: config
    })
    .after(err => {
      if (err) console.error('Error al cargar plugins:', err);
      console.log("Plugins cargados");
    })

    /* Cargar Swagger ANTES de las rutas */
    .register(swagger, {
        openapi: {
            info:{
                title: "CRUD Fastify Mongo Prisma API",
                description: "Documentación automática de la API con Swagger",
                version: "1.0.0",
            },
            servers: [{
                url: 'http://localhost:3010', description: 'Servidor local'
            }]
        }
    })
    .after(err => {
      if (err) console.error('Error al registrar Swagger:', err);
    })
  
    /* Register swagger UI plugin */
    .register(swaggerUI, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: "list",
            deepLinking: false
        },
        staticCSP: true,
        transformStaticCSP: (header: any) => header
    })
    .after(err => {
      if (err) console.error('Error al registrar Swagger UI:', err);
    })

    /* Cargar las rutas */
    .register(autoLoad, {
      dir: path.join(__dirname, 'routes'),
      options: config,
      dirNameRoutePrefix: true
    })
    .after(err => {
      if (err) console.error('Error al cargar rutas:', err);
    })

  // NOTE: el manejo de errores se realiza en el plugin `src/plugins/error`.
  // No registramos otro setErrorHandler aquí para evitar sobrescribir el del plugin.

  // Trick to handle empty body on POST
  // because POST {{APIURL}}/articles/{{slug}}/favorite will be done without a body
  server.addHook('onRequest', async (req: any) => {
    if (req.headers['content-type'] === 'application/json' && req.headers['content-length'] === '0') {
      req.headers['content-type'] = 'empty'
    }
  })
  server.addContentTypeParser('empty', (request: any, body: any, done: any) => {
    done(null, {})
  })
}

// module.exports = fp(plugin)
export default fp(plugin);

