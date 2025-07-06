import fp from 'fastify-plugin'

export default fp(
  async (fastify, opts) => {
    fastify.get('/status', async (request, reply) => {
      reply.code(200)

      return
    })
  },
  {
    name: 'status',
    dependencies: ['root', 'socketio'],
  }
)
