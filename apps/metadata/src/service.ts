import Emittery from 'emittery'
import type { ServerWritableStream } from '@grpc/grpc-js'
import VError from 'verror'

import { log } from '@project-maps/logging'
import {
  type GetPoiMetadataInput,
  type MetadataItem,
  UnimplementedMetadataService,
  type GetAreaMetadataInput,
} from '@project-maps/proto/metadata/node'

import type { Events, MetadataSource } from 'src/declarations/metadata-source'

import { OverpassSource } from 'src/sources/overpass'
import { GeographUKImageSource } from 'src/sources/geograph-uk'
import { WikimapiaSource } from 'src/sources/wikimapia'
import { MapillarySource } from 'src/sources/mapillary'
import { WikidataSource } from 'src/sources/wikidata'

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
    promiseFactory: (source: MetadataSource, sourceEmitter: Emittery<Events>) => Promise<void>
  ): { emitter: Emittery<Events>; done: Promise<void> } => {
    const emitter = new Emittery<Events>()

    const promises = sources.map((source) => {
      return promiseFactory(source, emitter).catch((error) => {
        log.error(
          new VError(
            error,
            `MetadataService.mergeSources: Error in source ${source.constructor.name}`
          )
        )
      })
    })

    const done = Promise.all(promises) as unknown as Promise<void>

    done.catch((error) => {
      log.error(new VError(error, 'MetadataService.mergeSources: Error in merging sources'))
    })

    return { emitter, done }
  }

  override GetAreaMetadata(call: ServerWritableStream<GetAreaMetadataInput, MetadataItem>): void {
    const { emitter, done } = MetadataService.mergeSources(
      MetadataService.sources,
      (source, sourceEmitter) => {
        return source.getAreaMetadata(call.request, sourceEmitter)
      }
    )

    const onItem = (item: MetadataItem) => {
      call.write(item)
    }

    emitter.on('item', onItem)

    done.then(() => {
      emitter.off('item', onItem)
      call.end()
    })
  }

  override GetPoiMetadata(call: ServerWritableStream<GetPoiMetadataInput, MetadataItem>): void {
    const { emitter, done } = MetadataService.mergeSources(
      MetadataService.sources,
      (source, sourceEmitter) => {
        return source.getPoiMetadata(call.request, sourceEmitter)
      }
    )

    const onItem = (item: MetadataItem) => {
      call.write(item)
    }

    emitter.on('item', onItem)

    done.then(() => {
      emitter.off('item', onItem)
      call.end()
    })
  }
}
