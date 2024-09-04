import fp from 'fastify-plugin'
import { locationImagesClient } from 'src/grpc-clients/location-images'

export default fp(async (fastify, opts) => {
  fastify.ready((err) => {
    if (err) throw err

    fastify.io.on('connection', (socket) => {
      socket.on('LocationImages', async (method, data) => {
        const result = locationImagesClient[method](data)

        result.on('data', (data) => {
          console.log('data', data)
        })

        result.on('end', () => {
          console.log('end')
        })
      })
    })
  })
}, {
  name: 'socketio',
})
