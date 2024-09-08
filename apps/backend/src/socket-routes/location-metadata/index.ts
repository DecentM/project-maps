import { LocationMetadataImages } from '@project-maps/proto/location-metadata/images'

import type {
  ClientToServerData,
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../declarations/socketio'
import { rpcToServiceMap, type MappedMethodNameByService } from '../../lib/rpc-to-service-map'
import type { Socket } from 'socket.io'

export const handleLocationMetadata =
  (socket: Socket<ClientToServerEvents, ServerToClientEvents>) =>
  async (
    method: MappedMethodNameByService<'LocationMetadata'>,
    data: ClientToServerData<'LocationMetadata'>
  ) => {
    const [, client] = rpcToServiceMap.LocationMetadata

    switch (method) {
      case 'GetLocationImages': {
        const result = client.GetLocationImages(
          LocationMetadataImages.GetLocationImagesRequest.fromObject(data)
        )

        result.on('data', (data) => {
          socket.emit('LocationMetadata', method, data.toObject())
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
