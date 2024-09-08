import type { Geospatial } from '@project-maps/proto/lib/geospatial'
import type { OpenStreetMap } from '@project-maps/proto/lib/openstreetmap'
import { LocationMetadataOverpass } from '@project-maps/proto/location-metadata/overpass'
import { OverpassInterpreter } from '@project-maps/proto/overpass-interpreter'

import { overpassClient } from 'src/clients/overpass-interpreter'
import { Source } from 'src/declarations/source'

const calculateScore = (item: ReturnType<OpenStreetMap.Node['toObject']> | ReturnType<OpenStreetMap.Way['toObject']> | ReturnType<OpenStreetMap.Relation['toObject']> | undefined): number => {
  let score = 0

  if (!item) return -1

  if (item.tags?.name) score += 1
  if (item.tags?.city) score += 1
  if (item.tags?.country) score += 1
  if (item.tags?.housenumber) score += 1
  if (item.tags?.postcode) score += 1
  if (item.tags?.state) score += 1
  if (item.tags?.street) score += 1
  if (item.tags?.phone) score += 1
  if (item.tags?.website) score += 1

  return score
}

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
    let result = LocationMetadataOverpass.GetLocationMetadataOutput.fromObject({})

    const resetResult = () => {
      result = LocationMetadataOverpass.GetLocationMetadataOutput.fromObject({})
    }

    if (!response.elements) {
      return result
    }

    let highestScore = -1

    for (const element of response.elements) {
      let item: ReturnType<OpenStreetMap.Node['toObject']> | ReturnType<OpenStreetMap.Way['toObject']> | ReturnType<OpenStreetMap.Relation['toObject']> | undefined

      if (element.way) item = element.way
      if (element.node) item = element.node
      if (element.relation) item = element.relation

      if (!item) {
        continue
      }

      // We'd prefer to show items with lots of metadata
      const score = calculateScore(item)

      if (score < highestScore) continue

      highestScore = score

      resetResult()

      result.name = item.tags?.name || ''
      result.address = LocationMetadataOverpass.Address.fromObject({
        city: item.tags?.['addr:city'] || '',
        country: item.tags?.['addr:country'] || '',
        housenumber: item.tags?.['addr:housenumber'] || '',
        postcode: item.tags?.['addr:postcode'] || '',
        state: item.tags?.['addr:state'] || '',
        street: item.tags?.['addr:street'] || '',
      })
      result.phone = item.tags?.phone || ''
      result.website = item.tags?.website || ''
    }

    return result
  }
}
