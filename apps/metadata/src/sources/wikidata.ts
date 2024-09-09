import type Emittery from 'emittery'
import { isEntityId, type EntityId } from 'wikibase-sdk'

import { Metadata } from '@project-maps/proto/metadata'
import type { Geospatial } from '@project-maps/proto/lib/geospatial'
import { OverpassInterpreter } from '@project-maps/proto/overpass-interpreter'

import { WikidataClient } from 'src/clients/wikidata'
import { MetadataSource, type Events } from 'src/declarations/metadata-source'
import { overpassClient } from 'src/clients/overpass-interpreter'

export class WikidataSource extends MetadataSource {
  private client = new WikidataClient()

  override handlesLocation(coordinates: Geospatial.Coordinates): boolean {
    return true // Handles all locations
  }

  public async getAreaMetadata(params: Metadata.GetAreaMetadataInput, events: Emittery<Events>): Promise<void> {
    const ids = overpassClient.WikidataIdsInRange(OverpassInterpreter.QueryParameters.fromObject({
      range: params.radiusMeters,
      coordinates: params.coordinates,
    }))

    const requestedIds: EntityId[] = []

    ids.on('data', async (data: OverpassInterpreter.WikidataId) => {
      if (isEntityId(data.id)) {
        requestedIds.push(data.id)
      }
    })

    ids.on('end', async () => {
      if (requestedIds.length === 0) {
        events.emit('end')
        return
      }

      const entities = await this.client.getEntities({
        ids: requestedIds
      })

      for (const requestedId of requestedIds) {
        const entity = entities[requestedId]

        if (!entity || entity.type !== 'item') {
          continue
        }

        const item = Metadata.AreaMetadataItem.fromObject({
          attribution: {
            source: Metadata.Attribution.Source.Wikidata,
            license: 'CC0',
            name: 'Wikidata',
            url: `https://www.wikidata.org/wiki/${requestedId}`,
          },
          description: {
            text: entity.descriptions?.en, // TODO: i18n
          }
        })

        events.emit('item', item)
      }

      events.emit('end')
    })

    ids.on('error', (error: Error) => {
      console.error(error)
      events.emit('end')
    })
  }
}