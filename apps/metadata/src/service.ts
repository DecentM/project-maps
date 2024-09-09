import Emittery from 'emittery'
import type { ServerWritableStream } from '@grpc/grpc-js'

import { Metadata } from '@project-maps/proto/metadata'

import type { Events, MetadataSource } from 'src/declarations/metadata-source'

import { OverpassSource } from 'src/sources/overpass'
import { GeographUKImageSource } from 'src/sources/geograph-uk'
import { WikimapiaSource } from 'src/sources/wikimapia'
import { MapillarySource } from './sources/mapillary'

export class MetadataService extends Metadata.UnimplementedMetadataService {
  private static sources: MetadataSource[] = [
    new GeographUKImageSource(),
    new OverpassSource(),
    new WikimapiaSource(),
    new MapillarySource(),
  ]

  private static aggregateEvents = (
    sources: MetadataSource[],
    request: Metadata.GetAreaMetadataInput
  ): Emittery<Events> => {
    const events = new Emittery<Events>()

    const emitters = sources.map((imageSource) => {
      const emitter = new Emittery<Events>()

      const onItem = (item: Metadata.AreaMetadataItem) => {
        events.emit('item', item)
      }

      const onEnd = () => {
        emitter.off('item', onItem)
        emitter.off('end', onEnd)

        const pending = emitters.filter((thatEmitter) => thatEmitter !== emitter)

        if (pending.length === 0) {
          events.emit('end')
        }
      }

      emitter.on('item', onItem)
      emitter.on('end', onEnd)

      const promise = imageSource.getAreaMetadata(request, emitter)

      if (promise instanceof Promise) {
        promise.catch((error) => {
          console.error(error)
        })
      }

      return emitter
    })

    return events
  }

  override GetAreaMetadata(
    call: ServerWritableStream<Metadata.GetAreaMetadataInput, Metadata.AreaMetadataItem>
  ): void {
    const events = MetadataService.aggregateEvents(MetadataService.sources, call.request)

    const onItem = (item: Metadata.AreaMetadataItem) => {
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
