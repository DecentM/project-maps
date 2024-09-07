import { LocationImages } from '@project-maps/proto/location-images'

import type {
  ClientToServerData,
  ClientToServerEvents,
  ServerToClientEvents,
} from '../declarations/socketio'
import { rpcToServiceMap, type MappedMethodNameByService } from '../lib/rpc-to-service-map'
import type { Socket } from 'socket.io'

export const handleLocationImages =
  (socket: Socket<ClientToServerEvents, ServerToClientEvents>) =>
  async (
    method: MappedMethodNameByService<'LocationImages'>,
    data: ClientToServerData<'LocationImages'>
  ) => {
    const [, client] = rpcToServiceMap.LocationImages

    switch (method) {
      case 'GetLocationImages': {
        const result = client.GetLocationImages(
          LocationImages.GetLocationImagesRequest.fromObject(data)
        )

        result.on('data', (data) => {
          socket.emit('LocationImages', method, data.toObject())
        })

        result.on('error', (error) => {
          console.error(error)
        })
        break
      }
      default:
        throw new Error(`Method ${method} not implemented`)
    }
  }
