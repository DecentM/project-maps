import Emittery from 'emittery'
import type { ServerWritableStream } from '@grpc/grpc-js'

import { log } from '@project-maps/logging'
import {
  UnimplementedMetadataService,
  type GetAreaMetadataInput,
  type GetPoiMetadataInput,
  type MetadataItem,
} from '@project-maps/proto/metadata/node'

import type { Events, MetadataSource } from 'src/declarations/metadata-source'

import { OverpassSource } from 'src/sources/overpass'
import { GeographUKImageSource } from 'src/sources/geograph-uk'
import { WikimapiaSource } from 'src/sources/wikimapia'
import { MapillarySource } from './sources/mapillary'
import { WikidataSource } from './sources/wikidata'

export class MetadataService extends UnimplementedMetadataService {
  private static sources: MetadataSource[] = [
    new GeographUKImageSource(),
    new OverpassSource(),
    new WikimapiaSource(),
    new WikidataSource(),
    new MapillarySource(),
  ]

  private static mergeSources = (
    sources: MetadataSource[],
    promiseFactory: (
      source: MetadataSource,
      sourceEmitter: Emittery<Events>
    ) => Promise<void> | void
  ): Emittery<Events> => {
    const emitter = new Emittery<Events>()
    let ended = 0

    for (const source of sources) {
      const sourceEmitter = new Emittery<Events>()

      sourceEmitter.on('item', (item) => emitter.emit('item', item))

      sourceEmitter.once('end').then(() => {
        ended += 1

        if (ended === sources.length) {
          emitter.emit('end')
        }
      })

      const promise = promiseFactory(source, sourceEmitter)

      if (promise instanceof Promise) {
        promise.catch((error) => {
          log.error(error)
          sourceEmitter.emit('end')
        })
      }
    }

    return emitter
  }

  override GetAreaMetadata(call: ServerWritableStream<GetAreaMetadataInput, MetadataItem>): void {
    const events = MetadataService.mergeSources(
      MetadataService.sources,
      (source, sourceEmitter) => {
        return source.getAreaMetadata(call.request, sourceEmitter)
      }
    )

    const onItem = (item: MetadataItem) => {
      call.write(item)
    }

    const onEnd = () => {
      events.off('item', onItem)
      events.off('end', onEnd)

      call.end()
    }

    events.on('item', onItem)
    events.on('end', onEnd)
  }

  override GetPoiMetadata(call: ServerWritableStream<GetPoiMetadataInput, MetadataItem>): void {
    const events = MetadataService.mergeSources(
      MetadataService.sources,
      (source, sourceEmitter) => {
        return source.getPoiMetadata(call.request, sourceEmitter)
      }
    )

    const onItem = (item: MetadataItem) => {
      call.write(item)
    }

    const onEnd = () => {
      events.off('item', onItem)
      events.off('end', onEnd)

      call.end()
    }

    events.on('item', onItem)
    events.on('end', onEnd)
  }
}
