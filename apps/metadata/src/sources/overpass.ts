import type Emittery from 'emittery'

import type { Geospatial } from '@project-maps/proto/lib/geospatial'
import type { OpenStreetMap } from '@project-maps/proto/lib/openstreetmap'
import { Metadata } from '@project-maps/proto/metadata'
import { OverpassInterpreter } from '@project-maps/proto/overpass-interpreter'

import { overpassClient } from 'src/clients/overpass-interpreter'
import { MetadataSource, type Events } from 'src/declarations/metadata-source'

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
  private static processElement(response: OpenStreetMap.Element, onItem: (item: Metadata.MetadataItem) => void): Metadata.MetadataItem {
    const element = response.toObject()
    let item:
      | ReturnType<OpenStreetMap.Node['toObject']>
      | ReturnType<OpenStreetMap.Way['toObject']>
      | ReturnType<OpenStreetMap.Relation['toObject']>
      | undefined

    if (element.way) item = element.way
    if (element.node) item = element.node
    if (element.relation) item = element.relation

    if (!item) {
      return Metadata.MetadataItem.fromObject({})
    }

    const result = Metadata.MetadataItem.fromObject({})

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

    onItem(result)

    return result
  }

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

    overpassResponse.on('data', (response: OpenStreetMap.Element) => {
      OverpassSource.processElement(response, (item) => {
        events.emit('item', item)
      })
    })

    events.emit('end')
  }

  public async getPoiMetadata(request: Metadata.GetPoiMetadataInput, events: Emittery<Events>): Promise<void> {
    const overpassResponse = overpassClient.PoiMetadata(
      OverpassInterpreter.PoiMetadataParameters.fromObject({
        id: request.id,
      })
    )

    overpassResponse.on('data', (response: OpenStreetMap.Element) => {
      OverpassSource.processElement(response, (item) => {
        events.emit('item', item)
      })
    })

    events.emit('end')
  }
}
