import path from 'node:path'
import AutoLoad from '@fastify/autoload'
import Fastify from 'fastify'
import VError from 'verror'

import {log} from '@project-maps/logging'

import { config } from './config'

const fastify = Fastify()

fastify.register(AutoLoad, {
  dir: path.join(import.meta.dirname, 'plugins'),
})

fastify.register(AutoLoad, {
  dir: path.join(import.meta.dirname, 'routes'),
})

fastify.listen({ host: config.server.host, port: config.server.port })
  .then(() => log.info(config.server, 'Server listening'))
  .catch((error) => log.error(new VError(error, 'Starting server')))

process.on('unhandledRejection', (error) => {
  if (error instanceof Error) {
    log.error(new VError(error, 'Unhandled rejection'))
  }
})

process.on('uncaughtException', (error) => {
  if (error instanceof Error) {
    log.error(new VError(error, 'Uncaught exception'))
  }
})
