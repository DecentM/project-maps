import { Metadata } from '@project-maps/proto/metadata'

import type { ClientToServerData } from '../../declarations/socketio'
import type { Socket } from 'socket.io'
import { metadataClient } from 'src/grpc-clients/metadata'

export const handleMetadata =
  (socket: Socket) => async (method: string, data: ClientToServerData<'LocationMetadata'>) => {
    switch (method) {
      case 'GetAreaMetadata': {
        const result = metadataClient.GetAreaMetadata(
          Metadata.GetAreaMetadataInput.fromObject(data)
        )

        result.on('data', (metadata) => {
          socket.emit('Metadata', 'GetAreaMetadata', metadata.toObject())
        })

        break
      }
      default:
        throw new Error(`Method ${method} not implemented`)
    }
  }
