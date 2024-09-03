import fp from 'fastify-plugin'
import Socketio from 'fastify-socket.io'

export default fp(async (fastify, opts) => {
  fastify.register(Socketio)
})
