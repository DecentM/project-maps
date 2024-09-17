import VError from 'verror'
import type { Socket } from 'socket.io'
import type { ClientReadableStream } from '@grpc/grpc-js'
import { log } from '@project-maps/logging'
import { Metadata } from '@project-maps/proto/metadata'

import { metadataClient } from 'src/grpc-clients/metadata'

export const handleMetadata =
  (socket: Socket) => async (method: string, data: object) => {
    try {
      let result: ClientReadableStream<unknown>

      switch (method) {
        case 'GetAreaMetadata':
          result = metadataClient.GetAreaMetadata(
            Metadata.GetAreaMetadataInput.fromObject(data)
          )
          break
        case 'GetPoiMetadata':
          result = metadataClient.GetPoiMetadata(
            Metadata.GetPoiMetadataInput.fromObject(data)
          )
          break
        default:
          throw new Error(`Method ${method} not implemented`)
      }

      result.on('data', (metadata) => {
        socket.emit('Metadata', method, metadata.toObject())
      })
    } catch (error) {
      if (error instanceof Error) {
        log.error(new VError(error, 'Handling metadata'))
      }
    }
  }
