import path from 'node:path'
import AutoLoad from '@fastify/autoload'
import Fastify from 'fastify'

const fastify = Fastify()

fastify.register(AutoLoad, {
  dir: path.join(import.meta.dirname, 'plugins'),
})

fastify.register(AutoLoad, {
  dir: path.join(import.meta.dirname, 'routes'),
})

fastify.listen({ port: 3000 })
  .then(() => console.log('Server started'))
  .catch(console.error)
