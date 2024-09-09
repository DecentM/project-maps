import type { Geospatial } from '@project-maps/proto/lib/geospatial'

import { WikimapiaClient } from 'src/clients/wikimapia'
import { config } from 'src/config'
import { Source } from 'src/declarations/source'

type GetLocationMetadataParams = {
  coords: Geospatial.Coordinates
}

export class WikimapiaSource extends Source {
  private client = new WikimapiaClient(
    config.clients.wikimapia.baseUrl,
    config.clients.wikimapia.apiKey
  )

  override handlesLocation(coordinates: Geospatial.Coordinates): boolean {
    return true // Handles all locations
  }

  public async getLocationMetadata(params: GetLocationMetadataParams) {
    const nearest = await this.client.Place_Getnearest({
      lat: params.coords.lat,
      lon: params.coords.lng,
      page: 1,
      count: 1,
    })

    return this.client.Place_Getbyid({
      id: nearest.places[0].id,
      data_blocks: 'location,photos,comments',
    })
  }
}
