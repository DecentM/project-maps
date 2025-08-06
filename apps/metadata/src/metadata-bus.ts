import Emittery from 'emittery'

import type { GetPoiMetadataInput } from '@project-maps/proto/metadata/node'

import { OverpassSource } from './sources/overpass'
import { GeographUKImageSource } from './sources/geograph-uk'

import type { Events, MetadataSource } from './declarations/metadata-source'
import { MapillarySource } from './sources/mapillary'
import { WikidataSource } from './sources/wikidata'
import { WikimapiaSource } from './sources/wikimapia'
import { WebsiteSource } from './sources/website'

export class MetadataBus {
  private static sources: MetadataSource[] = [
    new GeographUKImageSource(),
    new OverpassSource(),
    new MapillarySource(),
    new WikidataSource(),
    new WikimapiaSource(),
    new WebsiteSource(),
  ]

  private inProgress = 0

  public getPoiMetadata(request: GetPoiMetadataInput, emitter: Emittery<Events>): Promise<void> {
    return new Promise((resolve) => {
      // Cannot move to calss scope because of binding
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const handleStart = () => {
        this.inProgress++
      }

      const stops: Array<() => void> = []

      const teardown = () => {
        emitter.off('start', handleStart)
        emitter.off('stop', handleStop)

        for (const stop of stops) {
          stop()
        }
      }

      const handleStop = () => {
        this.inProgress--

        if (this.inProgress === 0) {
          teardown()
          resolve()
        }
      }

      emitter.on('start', handleStart)
      emitter.on('stop', handleStop)

      for (const source of MetadataBus.sources) {
        stops.push(source.listen(emitter))
      }

      emitter.emit('osm', request)
    })
  }
}
