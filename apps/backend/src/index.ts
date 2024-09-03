import path from 'node:path'
import AutoLoad from '@fastify/autoload'
import Fastify from 'fastify'
import { config } from './config'

const fastify = Fastify()

fastify.register(AutoLoad, {
  dir: path.join(import.meta.dirname, 'plugins'),
})

fastify.register(AutoLoad, {
  dir: path.join(import.meta.dirname, 'routes'),
})

fastify.listen({ host: config.server.host, port: config.server.port })
  .then(() => console.log(`Server listening on ${config.server.host}:${config.server.port}`))
  .catch(console.error)
