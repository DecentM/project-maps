import fp from 'fastify-plugin'

export default fp(
  async (fastify, opts) => {
    fastify.ready((err) => {
      if (err) throw err
    })
  },
  {
    name: 'socketio',
  }
)
