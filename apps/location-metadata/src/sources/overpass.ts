import type { Geospatial } from '@project-maps/proto/lib/geospatial'
import type { OpenStreetMap } from '@project-maps/proto/lib/openstreetmap'
import { LocationMetadataOverpass } from '@project-maps/proto/location-metadata/overpass'
import { OverpassInterpreter } from '@project-maps/proto/overpass-interpreter'

import { overpassClient } from 'src/clients/overpass-interpreter'
import { Source } from 'src/declarations/source'

export class OverpassSource extends Source {
  override handlesLocation(coordinates: Geospatial.Coordinates): boolean {
    return true // Handles all locations
  }

  public async getLocationMetadata(
    request: LocationMetadataOverpass.GetLocationMetadataInput
  ): Promise<LocationMetadataOverpass.GetLocationMetadataOutput> {
    const overpassResponse = await overpassClient.Query(OverpassInterpreter.QueryInput.fromObject({
      shortRangeNamedQueryParameters: {
        coordinates: request.coordinates.toObject(),
        range: request.radiusMeters,
      }
    }))

    const response = overpassResponse.toObject()
    const result = LocationMetadataOverpass.GetLocationMetadataOutput.fromObject({})

    if (!response.elements) {
      return result
    }

    for (const element of response.elements) {
      let item: ReturnType<OpenStreetMap.Node['toObject']> | ReturnType<OpenStreetMap.Way['toObject']> | ReturnType<OpenStreetMap.Relation['toObject']> | undefined

      if (element.way) item = element.way
      if (element.node) item = element.node
      if (element.relation) item = element.relation

      if (!item) {
        continue
      }

      result.name = item.tags?.name || ''
      result.address = LocationMetadataOverpass.Address.fromObject({
        city: item.tags?.city || '',
        country: item.tags?.country || '',
        housenumber: item.tags?.housenumber || '',
        postcode: item.tags?.postcode || '',
        state: item.tags?.state || '',
        street: item.tags?.street || '',
      })
      result.phone = item.tags?.phone || ''
      result.website = item.tags?.website || ''
    }

    return result
  }
}
