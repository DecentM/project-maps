import Emittery from 'emittery'
import type { ClientReadableStream } from 'grpc-web'
import type { Socket } from 'socket.io-client'

import type { BackendClient } from '@project-maps/proto/backend/web/client'
import type {
  GetAreaMetadataInput,
  GetPoiMetadataInput,
  MetadataItem,
} from '@project-maps/proto/metadata/web'
import type {
  PoiMetadataParameters,
  QueryParameters as OverpassQueryParameters,
  WikidataId,
} from '@project-maps/proto/overpass/web'
import type { Element } from '@project-maps/proto/lib/openstreetmap/web'
import type {
  QueryParameters as SearchQueryParameters,
  SearchResult,
} from '@project-maps/proto/search/web'

abstract class SocketService {
  constructor(private readonly socket: Socket) {}

  protected async rpc<T extends { data: unknown }>(
    method: string,
    data: object,
    events: Emittery<T>
  ) {
    const ack = await this.socket.emitWithAck('rpc', method, data)

    this.socket.on('rpc', (requestId, data) => {
      if (requestId !== ack) return

      events.emit('data', data)
    })

    this.socket.on('rpc-end', (requestId) => {
      if (requestId !== ack) return

      events.clearListeners()
    })
  }
}

type ExtractGeneric<T> = T extends ClientReadableStream<infer U> ? U : never

// biome-ignore lint/suspicious/noExplicitAny: Used as a constraint
type MethodGeneric<T, K extends keyof T> = T[K] extends (...args: any[]) => any
  ? ExtractGeneric<ReturnType<T[K]>>
  : never

// biome-ignore lint/suspicious/noExplicitAny: Used as a constraint
type ExtractArgument<T> = T extends (...args: infer P) => any ? P[0] : never

type SerialisableToObject = { toObject: () => unknown }

type Sterilised<T> = {
  [K in keyof Omit<
    T,
    'client_' | 'hostname_' | 'credentials_' | 'options_'
  > as K extends `methodDescriptor${string}` ? never : K]: (
    request: K extends keyof T
      ? ExtractArgument<T[K]> extends SerialisableToObject
        ? ReturnType<ExtractArgument<T[K]>['toObject']>
        : never
      : never
  ) => K extends keyof T
    ? Emittery<{
        data: MethodGeneric<T, K> extends SerialisableToObject
          ? ReturnType<MethodGeneric<T, K>['toObject']>
          : never
      }>
    : never
}

export class Backend extends SocketService implements Sterilised<BackendClient> {
  getAreaMetadata(
    request: GetAreaMetadataInput.AsObject
  ): Emittery<{ data: MetadataItem.AsObject }> {
    const events = new Emittery<{ data: MetadataItem.AsObject }>()

    this.rpc('GetAreaMetadata', request, events)

    return events
  }

  getPoiMetadata(request: GetPoiMetadataInput.AsObject): Emittery<{ data: MetadataItem.AsObject }> {
    throw new Error('Method not implemented.')
  }

  shortRangeNamed(): Emittery<{ data: Element.AsObject }> {
    throw new Error('Method not implemented.')
  }

  wikidataIdsInRange(
    request: OverpassQueryParameters.AsObject
  ): Emittery<{ data: WikidataId.AsObject }> {
    throw new Error('Method not implemented.')
  }

  poiMetadata(request: PoiMetadataParameters.AsObject): Emittery<{ data: Element.AsObject }> {
    throw new Error('Method not implemented.')
  }

  poiWikidataId(request: PoiMetadataParameters.AsObject): Emittery<{ data: WikidataId.AsObject }> {
    throw new Error('Method not implemented.')
  }

  query(request: SearchQueryParameters.AsObject): Emittery<{ data: SearchResult.AsObject }> {
    throw new Error('Method not implemented.')
  }
}
