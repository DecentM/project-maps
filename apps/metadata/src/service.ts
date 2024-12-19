import Emittery from 'emittery'
import type { ServerWritableStream } from '@grpc/grpc-js'

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
import { log } from '@project-maps/logging'
import VError from 'verror'

export class MetadataService extends UnimplementedMetadataService {
  private static sources: MetadataSource[] = [
    new GeographUKImageSource(),
    new OverpassSource(),
    new WikimapiaSource(),
    new MapillarySource(),
    new WikidataSource(),
  ]

  private static mergeEmitters = (emitters: Emittery<Events>[]): Emittery<Events> => {
    const emitter = new Emittery<Events>()
    let ended = 0

    for (const source of emitters) {
      source.on('item', (item) => emitter.emit('item', item))

      source.once('end').then(() => {
        ended += 1
        if (ended === emitters.length) {
          emitter.emit('end')
        }
      })
    }

    return emitter
  }

  override GetAreaMetadata(call: ServerWritableStream<GetAreaMetadataInput, MetadataItem>): void {
    const events = MetadataService.mergeEmitters(
      MetadataService.sources.map((source) => {
        const emitter = new Emittery<Events>()
        const promise = source.getAreaMetadata(call.request, emitter)

        if (promise instanceof Promise) {
          promise.catch((error) => {
            log.error(new VError(error, 'MetadataService.GetAreaMetadata'))
            emitter.emit('end')
          })
        }

        return emitter
      })
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
    const events = MetadataService.mergeEmitters(
      MetadataService.sources.map((source) => {
        const emitter = new Emittery<Events>()
        const promise = source.getPoiMetadata(call.request, emitter)

        if (promise instanceof Promise) {
          promise.catch((error) => {
            log.error(new VError(error, 'MetadataService.GetPoiMetadata'))
            emitter.emit('end')
          })
        }

        return emitter
      })
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
