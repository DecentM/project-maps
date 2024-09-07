import fp from 'fastify-plugin'

import { attachSocketRoutes } from '../socket-routes'

export default fp(async (fastify, opts) => {
  fastify.ready((err) => {
    if (err) throw err

    fastify.io.on('connection', (socket) => {
      attachSocketRoutes(socket)
    })
  })
}, {
  name: 'socketio',
})
