import { LocationImages } from '@project-maps/proto/location-images'
import fp from 'fastify-plugin'
import { rpcToServiceMap } from 'src/lib/rpc-to-service-map'

export default fp(async (fastify, opts) => {
  fastify.ready((err) => {
    if (err) throw err

    fastify.io.on('connection', (socket) => {
      socket.on('LocationImages', async (method, data) => {
        const [, client] = rpcToServiceMap.LocationImages
        const result = client[method](LocationImages.GetLocationImagesRequest.fromObject(data))

        result.on('data', (data) => {
          socket.emit('LocationImages', method, data.toObject())
        })
      })
    })
  })
}, {
  name: 'socketio',
})
