import * as path from 'path'
import fp from 'fastify-plugin'
import autoLoad from '@fastify/autoload'
import cors from '@fastify/cors'
import { FastifyInstance } from 'fastify'

/**
 * Configure and starts Fastify server with all required plugins and routes
 * @async
 * @param {Fastify.Server} server - Fastify server instance
 * @param {Object} config - optional configuration options (default to ./config module)
 *                          May contain a key per plugin (key is plugin name), and an extra
 *                          'fastify' key containing the server configuration object
 * @returns {Fastify.Server} started Fastify server instance
 */

async function plugin (server: FastifyInstance, config: Record<string, any>) {
  server
    .register(cors, {})
    // Enable all CORS requests
    .register(autoLoad, {
      dir: path.join(__dirname, 'plugins'),
      options: config
    })
    // Load all plugins
    .register(autoLoad, {
      dir: path.join(__dirname, 'services'),
      options: config
    })
    // Load all services
    .register(autoLoad, {
      dir: path.join(__dirname, 'routes'),
      options: config,
      dirNameRoutePrefix: false
    })
    // Load all routes

  server.setErrorHandler((err: any, req: any, res: any) => {
    req.log.error({ req, res, err }, err && err.message)
    err.message = 'An error has occurred'
    res.send(err)
  })

  // Trick to handle empty body on POST
  // because POST {{APIURL}}/articles/{{slug}}/favorite will be done without a body
  server.addHook('onRequest', async (req: any, res: any) => {
    if (req.headers['content-type'] === 'application/json' && req.headers['content-length'] === '0') {
      req.headers['content-type'] = 'empty'
    }
  })
  server.addContentTypeParser('empty', (request: any, body: any, done: any) => {
    done(null, {})
  })
}

module.exports = fp(plugin)


