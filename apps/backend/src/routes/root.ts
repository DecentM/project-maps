import fp from 'fastify-plugin'

export default fp(async (fastify, opts) => {
  fastify.get('/', async (request, reply) => {
    return { root: true }
  })
}, {
  name: 'root',
})
