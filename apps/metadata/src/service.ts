import Emittery from 'emittery'
import type { ServerWritableStream } from '@grpc/grpc-js'

import { Metadata } from '@project-maps/proto/metadata'

import type { Events, MetadataSource } from 'src/declarations/metadata-source'

import { OverpassSource } from 'src/sources/overpass'
import { GeographUKImageSource } from 'src/sources/geograph-uk'
import { WikimapiaSource } from 'src/sources/wikimapia'
import { MapillarySource } from './sources/mapillary'
import { WikidataSource } from './sources/wikidata'

export class MetadataService extends Metadata.UnimplementedMetadataService {
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
      source.on('end', () => {
        ended += 1
        if (ended === emitters.length) {
          emitter.emit('end')
        }
      })
    }

    return emitter
  }

  override GetAreaMetadata(
    call: ServerWritableStream<Metadata.GetAreaMetadataInput, Metadata.MetadataItem>
  ): void {
    const events = MetadataService.mergeEmitters(
      MetadataService.sources.map((source) => {
        const emitter = new Emittery<Events>()
        const promise = source.getAreaMetadata(call.request, emitter)

        if (promise instanceof Promise) {
          promise.catch((error) => {
            console.error(error)
            emitter.emit('end')
          })
        }

        return emitter
      })
    )

    const onItem = (item: Metadata.MetadataItem) => {
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

  override GetPoiMetadata(
    call: ServerWritableStream<Metadata.GetPoiMetadataInput, Metadata.MetadataItem>
  ): void {
    const events = MetadataService.mergeEmitters(
      MetadataService.sources.map((source) => {
        const emitter = new Emittery<Events>()
        const promise = source.getPoiMetadata(call.request, emitter)

        if (promise instanceof Promise) {
          promise.catch((error) => {
            console.error(error)
            emitter.emit('end')
          })
        }

        return emitter
      })
    )

    const onItem = (item: Metadata.MetadataItem) => {
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
