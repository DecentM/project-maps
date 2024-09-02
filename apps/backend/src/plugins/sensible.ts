import fp from 'fastify-plugin'
import Sensible from '@fastify/sensible'

export default fp(async (fastify, opts) => {
  fastify.register(Sensible)
})
