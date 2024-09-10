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
      score = -1
    }
  }

  if (item.tags?.amenity) {
    score += 1
  }

  return score
}

const processHousenumber = (housenumber: string): string => {
  let result = housenumber

  if (result.includes(',')) {
    result = result.split(',').join('-')
  }

  if (result.startsWith('"') && result.endsWith('"')) {
    result = result.slice(1, -1)
  }

  return result
}

export class OverpassSource extends MetadataSource {
  override handlesLocation(coordinates: Geospatial.Coordinates): boolean {
    return true // Handles all locations
  }

  public async getAreaMetadata(request: Metadata.GetAreaMetadataInput, events: Emittery<Events>): Promise<void> {
    const overpassResponse = overpassClient.ShortRangeNamed(
      OverpassInterpreter.QueryParameters.fromObject({
        coordinates: request.coordinates.toObject(),
        range: request.radiusMeters,
      })
    )

    const elements: ReturnType<OpenStreetMap.Element['toObject']>[] = []
    let highestScore = -1

    let result = Metadata.MetadataItem.fromObject({})

    const resetResult = () => {
      result = Metadata.MetadataItem.fromObject({})
    }

    overpassResponse.on('data', (response: OpenStreetMap.Element) => {
      const element = response.toObject()
      elements.push(element)

      let item:
        | ReturnType<OpenStreetMap.Node['toObject']>
        | ReturnType<OpenStreetMap.Way['toObject']>
        | ReturnType<OpenStreetMap.Relation['toObject']>
        | undefined

      if (element.way) item = element.way
      if (element.node) item = element.node
      if (element.relation) item = element.relation

      if (!item) {
        return
      }

      // We'd prefer to show items with lots of metadata
      const score = calculateScore(request.coordinates, elements.map(e => e.node ?? null).filter(e => e !== null), item)

      if (score < highestScore) return

      highestScore = score

      resetResult()

      result.attribution = Metadata.Attribution.fromObject({
        source: Metadata.Attribution.Source.OpenStreetMap,
        license: 'ODbL',
        url: item.id ? `https://www.openstreetmap.org/${Object.keys(element)[0]}/${item.id}` : 'https://www.openstreetmap.org/',
        name: String(item.id ?? 'OpenStreetMap'),
      })

      result.metadata = Metadata.TextMetadata.fromObject({})
      result.metadata.name = item.tags?.name || ''
      result.metadata.address = Metadata.Address.fromObject({
        city: item.tags?.['addr:city'] || '',
        country: item.tags?.['addr:country'] || '',
        housenumber: processHousenumber(item.tags?.['addr:housenumber'] || ''),
        postcode: item.tags?.['addr:postcode'] || '',
        state: item.tags?.['addr:state'] || '',
        street: item.tags?.['addr:street'] || '',
      })
      result.metadata.phone = item.tags?.phone || ''
      result.metadata.website = item.tags?.website || ''

      events.emit('item', result)
    })

    events.emit('end')
  }

  public async getPoiMetadata(request: Metadata.GetPoiMetadataInput, events: Emittery<Events>): Promise<void> {
    const overpassResponse = overpassClient.PoiMetadata(
      OverpassInterpreter.PoiMetadataParameters.fromObject({
        id: request.id,
      })
    )

    const elements: ReturnType<OpenStreetMap.Element['toObject']>[] = []

    overpassResponse.on('data', (response: OpenStreetMap.Element) => {
      const element = response.toObject()
      elements.push(element)

      let item:
        | ReturnType<OpenStreetMap.Node['toObject']>
        | ReturnType<OpenStreetMap.Way['toObject']>
        | ReturnType<OpenStreetMap.Relation['toObject']>
        | undefined

      if (element.way) item = element.way
      if (element.node) item = element.node
      if (element.relation) item = element.relation

      if (!item) {
        return
      }

      const result = Metadata.MetadataItem.fromObject({
        attribution: Metadata.Attribution.fromObject({
          source: Metadata.Attribution.Source.OpenStreetMap,
          license: 'ODbL',
          url: item.id ? `https://www.openstreetmap.org/${Object.keys(element)[0]}/${item.id}` : 'https://www.openstreetmap.org/',
          name: String(item.id ?? 'OpenStreetMap'),
        }),
        metadata: Metadata.TextMetadata.fromObject({
          name: item.tags?.name || '',
        }),
      })

      events.emit('item', result)
    })

    events.emit('end')
  }
}
