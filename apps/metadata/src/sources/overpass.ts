import Emittery from 'emittery'

import type { Geospatial } from '@project-maps/proto/lib/geospatial'
import type { OpenStreetMap } from '@project-maps/proto/lib/openstreetmap'
import { Metadata } from '@project-maps/proto/metadata'
import { OverpassInterpreter } from '@project-maps/proto/overpass-interpreter'

import { overpassClient } from 'src/clients/overpass-interpreter'
import { MetadataSource, type Events } from 'src/declarations/metadata-source'

const calculateScore = (
  item:
    | ReturnType<OpenStreetMap.Node['toObject']>
    | ReturnType<OpenStreetMap.Way['toObject']>
    | ReturnType<OpenStreetMap.Relation['toObject']>
    | undefined
): number => {
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

export class OverpassSource extends MetadataSource {
  override handlesLocation(coordinates: Geospatial.Coordinates): boolean {
    return true // Handles all locations
  }

  public getAreaMetadata(request: Metadata.GetAreaMetadataInput): Emittery<Events> {
    const events = new Emittery<Events>();

    (async () => {
      const overpassResponse = await overpassClient.Query(
        OverpassInterpreter.QueryInput.fromObject({
          shortRangeNamedQueryParameters: {
            coordinates: request.coordinates.toObject(),
            range: request.radiusMeters,
          },
        })
      )

      const response = overpassResponse.toObject()
      let result = Metadata.AreaMetadataItem.fromObject({})

      const resetResult = () => {
        result = Metadata.AreaMetadataItem.fromObject({})
      }

      if (!response.elements) {
        events.emit('end')
        return
      }

      let highestScore = -1

      for (const element of response.elements) {
        let item:
          | ReturnType<OpenStreetMap.Node['toObject']>
          | ReturnType<OpenStreetMap.Way['toObject']>
          | ReturnType<OpenStreetMap.Relation['toObject']>
          | undefined

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

        result.metadata = Metadata.TextMetadata.fromObject({})
        result.metadata.name = item.tags?.name || ''
        result.metadata.address = Metadata.Address.fromObject({
          city: item.tags?.['addr:city'] || '',
          country: item.tags?.['addr:country'] || '',
          housenumber: item.tags?.['addr:housenumber'] || '',
          postcode: item.tags?.['addr:postcode'] || '',
          state: item.tags?.['addr:state'] || '',
          street: item.tags?.['addr:street'] || '',
        })
        result.metadata.phone = item.tags?.phone || ''
        result.metadata.website = item.tags?.website || ''
      }

      events.emit('item', result)

      return
    })()
    .catch((error) => console.error(error))

    return events
  }
}
