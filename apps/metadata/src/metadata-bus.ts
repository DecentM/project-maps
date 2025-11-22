import Emittery from 'emittery'

import type { GetPoiMetadataInput } from '@project-maps/proto/metadata/node'

import { config } from './config'

import type { Events, MetadataSource } from './declarations/metadata-source'

import { GeographUKImageSource } from './sources/geograph-uk'
import { MapillarySource } from './sources/mapillary'
import { WikidataSource } from './sources/wikidata'
import { WikimapiaSource } from './sources/wikimapia'
import { WebsiteSource } from './sources/website'
import { NominatimSource } from './sources/nominatim'
import { BBCSource } from './sources/bbc'

import { GeographClient } from './clients/geograph'
import { MapillaryClient } from './clients/mapillary'
import { WikidataClient } from './clients/wikidata'
import { WikimapiaClient } from './clients/wikimapia'
import { WebsiteClient } from './clients/website'
import { NominatimClient } from './clients/nominatim'
import { BBCClient } from './clients/bbc'

export class MetadataBus {
  private static sources: MetadataSource[] = [
    new GeographUKImageSource(
      new GeographClient(config.clients.geographUK.baseUrl, config.clients.geographUK.apiKey)
    ),
    new MapillarySource(
      new MapillaryClient(config.clients.mapillary.baseUrl, config.clients.mapillary.apiKey)
    ),
    new WikidataSource(new WikidataClient()),
    new WikimapiaSource(
      new WikimapiaClient(config.clients.wikimapia.baseUrl, config.clients.wikimapia.apiKey)
    ),
    new WebsiteSource(new WebsiteClient()),
    new NominatimSource(new NominatimClient()),
    new BBCSource(new BBCClient()),
  ]

  private inProgress = 0

  public getPoiMetadata(request: GetPoiMetadataInput, emitter: Emittery<Events>): Promise<void> {
    // Cannot move to class because then we'd have to .bind(this)
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const handleStart = () => {
      this.inProgress++
    }

    return new Promise((resolve) => {
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
