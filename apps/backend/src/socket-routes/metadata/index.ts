import VError from 'verror'
import type { ClientReadableStream } from '@grpc/grpc-js'

import { log } from '@project-maps/logging'
import { GetPoiMetadataInput, GetAreaMetadataInput } from '@project-maps/proto/metadata/node'

import { metadataClient } from 'src/grpc-clients/metadata'

export const handleMetadataMessage = (msg: any) => {
  try {
    let result: ClientReadableStream<unknown>

    switch (msg.method) {
      case 'GetAreaMetadata':
        result = metadataClient.GetAreaMetadata(GetAreaMetadataInput.deserializeBinary(msg.payload))
        break
      case 'GetPoiMetadata':
        result = metadataClient.GetPoiMetadata(GetPoiMetadataInput.deserializeBinary(msg.payload))
        break
      default:
        throw new Error(`Method "${msg.method}" not implemented`)
    }

    result.on('error', (error) => {
      log.error(new VError(error, 'Handling metadata'))
    })

    return result
  } catch (error) {
    if (error instanceof Error) {
      log.error(new VError(error, 'Handling metadata'))
    }

    log.error(error, 'Handling metadata')
  }

  return null
}
