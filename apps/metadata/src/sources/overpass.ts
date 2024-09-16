import type Emittery from 'emittery'

import type { Geospatial } from '@project-maps/proto/lib/geospatial'
import type { OpenStreetMap } from '@project-maps/proto/lib/openstreetmap'
import { Metadata } from '@project-maps/proto/metadata'
import { Overpass } from '@project-maps/proto/overpass'

import { overpassClient } from 'src/clients/overpass'
import { MetadataSource, type Events } from 'src/declarations/metadata-source'

export class OverpassSource extends MetadataSource {
  private static requestedTags = [
      'addr:city',
      'addr:housenumber',
      'addr:postcode',
      'addr:state',
      'addr:street',
      'name',
      'name:latin',
      'name:en',
      'amenity',
      'phone',
      'website',
      'leisure',
      'shop',
      'barrier',
      'wheelchair',
      'tourism',
      'artwork_type',
      'landuse',
  ]

  private static processElement(
    response: OpenStreetMap.Element,
    onItem: (item: Metadata.MetadataItem) => void
  ): Metadata.MetadataItem {
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
      url: item.id
        ? `https://www.openstreetmap.org/${Object.keys(element)[0]}/${item.id}`
        : 'https://www.openstreetmap.org/',
      name: String(item.id ?? 'OpenStreetMap'),
    })

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
    result.metadata.amenity = item.tags?.amenity || ''

    onItem(result)

    return result
  }

  override handlesLocation(coordinates: Geospatial.Coordinates): boolean {
    return true // Handles all locations
  }

  public async getAreaMetadata(
    request: Metadata.GetAreaMetadataInput,
    events: Emittery<Events>
  ): Promise<void> {
    const overpassResponse = overpassClient.ShortRangeNamed(
      Overpass.QueryParameters.fromObject({
        coordinates: request.coordinates.toObject(),
        range: request.radiusMeters,
        tags: OverpassSource.requestedTags,
      })
    )

    overpassResponse.on('data', (response: OpenStreetMap.Element) => {
      OverpassSource.processElement(response, (item) => {
        events.emit('item', item)
      })
    })

    events.emit('end')
  }

  public async getPoiMetadata(
    request: Metadata.GetPoiMetadataInput,
    events: Emittery<Events>
  ): Promise<void> {
    const overpassResponse = overpassClient.PoiMetadata(
      Overpass.PoiMetadataParameters.fromObject({
        id: request.id,
        tags: OverpassSource.requestedTags,
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
