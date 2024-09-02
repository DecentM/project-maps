import fp from 'fastify-plugin'
import Cors from '@fastify/cors'

export default fp(async (fastify, opts) => {
  await fastify.register(Cors)
})
