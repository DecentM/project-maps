import VError from 'verror'
import type { Socket } from 'socket.io'
import type { ClientReadableStream } from '@grpc/grpc-js'
import { log } from '@project-maps/logging'
import { GetPoiMetadataInput, GetAreaMetadataInput } from '@project-maps/proto/metadata/node'

import { metadataClient } from 'src/grpc-clients/metadata'

export const handleMetadata = (socket: Socket) => async (method: string, data: object) => {
  try {
    let result: ClientReadableStream<unknown>

    switch (method) {
      case 'GetAreaMetadata':
        result = metadataClient.GetAreaMetadata(GetAreaMetadataInput.fromObject(data))
        break
      case 'GetPoiMetadata':
        result = metadataClient.GetPoiMetadata(GetPoiMetadataInput.fromObject(data))
        break
      default:
        throw new Error(`Method "${method}" not implemented`)
    }

    result.on('data', (metadata) => {
      socket.emit('Metadata', method, metadata.toObject(), false)
    })

    result.on('end', () => {
      socket.emit('Metadata', method, null, true)
    })

    result.on('error', (error) => {
      log.error(new VError(error, 'Handling metadata'))
    })
  } catch (error) {
    if (error instanceof Error) {
      log.error(new VError(error, 'Handling metadata'))
    }

    log.error(error, 'Handling metadata')
  }
}
