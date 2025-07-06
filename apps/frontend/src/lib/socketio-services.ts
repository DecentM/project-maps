import Emittery from 'emittery'
import type { Socket } from 'socket.io-client'

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

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type ExtractGeneric<T> = any

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

export class Backend extends SocketService implements Sterilised<unknown> {
  getAreaMetadata(request: GetAreaMetadataInput): Emittery<{ data: MetadataItem }> {
    const events = new Emittery<{ data: MetadataItem }>()

    this.rpc('GetAreaMetadata', request, events)

    return events
  }

  getPoiMetadata(request: GetPoiMetadataInput): Emittery<{ data: MetadataItem }> {
    throw new Error('Method not implemented.')
  }

  shortRangeNamed(): Emittery<{ data: Element }> {
    throw new Error('Method not implemented.')
  }

  wikidataIdsInRange(request: OverpassQueryParameters): Emittery<{ data: WikidataId }> {
    throw new Error('Method not implemented.')
  }

  poiMetadata(request: PoiMetadataParameters): Emittery<{ data: Element }> {
    throw new Error('Method not implemented.')
  }

  poiWikidataId(request: PoiMetadataParameters): Emittery<{ data: WikidataId }> {
    throw new Error('Method not implemented.')
  }

  query(request: SearchQueryParameters): Emittery<{ data: SearchResult }> {
    throw new Error('Method not implemented.')
  }
}
