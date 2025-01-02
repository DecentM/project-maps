import type { Socket } from 'socket.io'
import crypto from 'node:crypto'

import { metadataClient } from 'src/grpc-clients/metadata'
import type { ClientReadableStream } from '@grpc/grpc-js'
import { GetAreaMetadataInput } from '@project-maps/proto/metadata/node'
import { log } from '@project-maps/logging'

const isClientReadableStream = <T>(value: unknown): value is ClientReadableStream<T> => {
  return typeof value === 'object' && value !== null && 'read' in value && 'deserialize' in value
}

export const attachSocketRoutes = (socket: Socket) => {
  socket.on('rpc', (method: string, data, callback) => {
    const requestId = crypto.randomBytes(16).toString('hex')

    callback(requestId)

    let streamOrPromise: Promise<unknown> | ClientReadableStream<unknown> | undefined = undefined
    // biome-ignore lint/suspicious/noExplicitAny: Overridden by indivisual assignments
    let deserialisationFn: (data: any) => unknown = (data: unknown) => data

    switch (method) {
      case 'GetAreaMetadata':
        streamOrPromise = metadataClient.GetAreaMetadata(GetAreaMetadataInput.fromObject(data))
        deserialisationFn = (data) => data.toObject()
        break
      default:
        console.error('Unknown method:', method)
    }

    if (streamOrPromise instanceof Promise) {
      streamOrPromise
        .then((response) => {
          socket.emit('rpc', requestId, deserialisationFn(response))
          socket.emit('rpc-end', requestId)
        })
        .catch((error) => {
          socket.emit('rpc', requestId, { error: error.message })
          socket.emit('rpc-end', requestId)
        })

      return
    }

    if (isClientReadableStream(streamOrPromise)) {
      streamOrPromise.on('data', (response) => {
        socket.emit('rpc', requestId, deserialisationFn(response))
      })

      streamOrPromise.on('close', () => {
        socket.emit('rpc-end', requestId)
        streamOrPromise.cancel()
      })

      return
    }

    log.warn('No stream or promise returned from method:', method)

    socket.emit('rpc-end', requestId)
  })
}
