import type Emittery from 'emittery'

import type { Geospatial } from '@project-maps/proto/lib/geospatial'
import type { OpenStreetMap } from '@project-maps/proto/lib/openstreetmap'
import { Metadata } from '@project-maps/proto/metadata'
import { OverpassInterpreter } from '@project-maps/proto/overpass-interpreter'

import { overpassClient } from 'src/clients/overpass-interpreter'
import { MetadataSource, type Events } from 'src/declarations/metadata-source'

const calculateScore = (
  coordinates: Geospatial.Coordinates,
  nodes: ReturnType<OpenStreetMap.Node['toObject']>[],
  item:
    | ReturnType<OpenStreetMap.Node['toObject']>
    | ReturnType<OpenStreetMap.Way['toObject']>
    | ReturnType<OpenStreetMap.Relation['toObject']>
    | undefined
): number => {
  let score = 0

  if (!item) return -1

  // Score based on distance
  let distance = Number.MAX_SAFE_INTEGER

  if ('lat' in item && 'lon' in item && item.lat && item.lon) {
    distance = Math.sqrt(
      (coordinates.lat - item.lat) ** 2 + (coordinates.lng - item.lon) ** 2
    )
  }

  if ('nodes' in item && item.nodes) {
    for (const nodeId of item.nodes) {
      const node = nodes.find((node) => node.id === nodeId)

      if (!node) continue

      if ('lat' in node && 'lon' in node && node.lat && node.lon) {
        const nodeDistance = Math.sqrt(
          (coordinates.lat - node.lat) ** 2 + (coordinates.lng - node.lon) ** 2
        )

        if (nodeDistance < distance) {
          distance = nodeDistance
        }
      }
    }
  }

  score += (1 / distance) / 800

  if (item.tags) {
    // Score based on metadata
    score += Object.keys(item.tags).length / 3

    // Score based on name
    if (!item.tags.name) {
      score -= 2
    }
  }

  return score
}

export class OverpassSource extends MetadataSource {
  override handlesLocation(coordinates: Geospatial.Coordinates): boolean {
    return true // Handles all locations
  }

  public async getAreaMetadata(request: Metadata.GetAreaMetadataInput, events: Emittery<Events>): Promise<void> {
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
      const score = calculateScore(request.coordinates, response.elements.map(e => e.node ?? null).filter(e => e !== null), item)

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
    events.emit('end')
  }
}
