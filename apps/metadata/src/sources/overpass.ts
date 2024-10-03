import type Emittery from 'emittery'
import Timezone from 'geo-tz'
import { DateTime, IANAZone, Interval, type Zone } from 'luxon'

import type { OpenStreetMap } from '@project-maps/proto/lib/openstreetmap'
import { Metadata } from '@project-maps/proto/metadata'
import { Overpass } from '@project-maps/proto/overpass'
import * as OpeningHours from '@project-maps/opening-hours-parser'

import { OverpassClient } from 'src/clients/overpass'
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
    'opening_hours',
    'bench',
    'bin',
    'bus',
    'highway',
    'lit',
  ]

  private static processElement(
    response: OpenStreetMap.Element,
    zone: Zone,
    onItem: (item: Metadata.MetadataItem) => void
  ): void {
    const element = response.toObject()
    let item:
      | ReturnType<OpenStreetMap.Node['toObject']>
      | ReturnType<OpenStreetMap.Way['toObject']>
      | ReturnType<OpenStreetMap.Relation['toObject']>
      | undefined

    if (element.way) item = element.way
    if (element.node) item = element.node
    if (element.relation) item = element.relation

    if (!item) return

    onItem(
      Metadata.MetadataItem.fromObject({
        attribution: {
          source: Metadata.Attribution.Source.OpenStreetMap,
          license: 'ODbL',
          url: item.id
            ? `https://www.openstreetmap.org/${Object.keys(element)[0]}/${item.id}`
            : 'https://www.openstreetmap.org/',
          name: String(item.id ?? 'OpenStreetMap'),
        },
        metadata: {
          name: item.tags?.name || '',
          address: {
            city: item.tags?.['addr:city'] || '',
            country: item.tags?.['addr:country'] || '',
            housenumber: item.tags?.['addr:housenumber'] || '',
            postcode: item.tags?.['addr:postcode'] || '',
            state: item.tags?.['addr:state'] || '',
            street: item.tags?.['addr:street'] || '',
          },
          phone: item.tags?.phone || '',
          website: item.tags?.website || '',
          amenity: item.tags?.amenity || '',
        },
      })
    )

    if (!item.tags?.opening_hours) return

    const intervals = OpeningHours.parse(
      item.tags.opening_hours,
      Interval.after(DateTime.now().setZone(zone).startOf('week'), { days: 7 }),
      zone
    )

    onItem(
      Metadata.MetadataItem.fromObject({
        attribution: {
          source: Metadata.Attribution.Source.OpenStreetMap,
          license: 'ODbL',
          url: item.id
            ? `https://www.openstreetmap.org/${Object.keys(element)[0]}/${item.id}`
            : 'https://www.openstreetmap.org/',
          name: String(item.id ?? 'OpenStreetMap'),
        },
        openingHours: {
          ranges: intervals.map((interval) => ({
            unknown: interval.unknown,
            details: interval.detail,
            start: {
              millis: interval.start.isValid ? interval.start.toMillis() : undefined,
            },
            end: {
              millis: interval.end.isValid ? interval.end.toMillis() : undefined,
            },
          })),
        },
      })
    )
  }

  private client = new OverpassClient()

  override handlesLocation(): boolean {
    return true // Handles all locations
  }

  public async getAreaMetadata(
    request: Metadata.GetAreaMetadataInput,
    events: Emittery<Events>
  ): Promise<void> {
    const overpassResponse = this.client.ShortRangeNamed(
      Overpass.QueryParameters.fromObject({
        coordinates: request.coordinates.toObject(),
        range: request.radiusMeters,
        tags: OverpassSource.requestedTags,
      })
    )

    const zone = IANAZone.create(Timezone.find(request.coordinates.lat, request.coordinates.lng)[0])

    overpassResponse.on('data', (response: OpenStreetMap.Element) => {
      OverpassSource.processElement(response, zone, (item) => {
        events.emit('item', item)
      })
    })

    overpassResponse.on('end', () => {
      events.emit('end')
    })
  }

  public async getPoiMetadata(
    request: Metadata.GetPoiMetadataInput,
    events: Emittery<Events>
  ): Promise<void> {
    const overpassResponse = this.client.PoiMetadata(
      Overpass.PoiMetadataParameters.fromObject({
        id: request.id,
        tags: OverpassSource.requestedTags,
      })
    )

    const zone = IANAZone.create(Timezone.find(request.coordinates.lat, request.coordinates.lng)[0])

    overpassResponse.on('data', (response: OpenStreetMap.Element) => {
      OverpassSource.processElement(response, zone, (item) => {
        events.emit('item', item)
      })
    })

    overpassResponse.on('end', () => {
      events.emit('end')
    })
  }
}
