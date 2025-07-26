import type Emittery from 'emittery'
import Timezone from 'geo-tz'
import { IANAZone, type Zone } from 'luxon'

import type { Element, Node, Way, Relation } from '@project-maps/proto/lib/openstreetmap/node'
import {
  AttributionSource,
  MetadataItem,
  type GetAreaMetadataInput,
  type GetPoiMetadataInput,
} from '@project-maps/proto/metadata/node'
import { QueryParameters, PoiMetadataParameters } from '@project-maps/proto/overpass/node'

import { OverpassClient } from 'src/clients/overpass'
import { MetadataSource, type Events } from 'src/declarations/metadata-source'
import { log } from '@project-maps/logging'
import VError from 'verror'

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
    response: Element,
    zone: Zone,
    onItem: (item: MetadataItem) => void
  ): void {
    const element = response.toObject()
    let item:
      | ReturnType<Node['toObject']>
      | ReturnType<Way['toObject']>
      | ReturnType<Relation['toObject']>
      | undefined

    if (element.way) item = element.way
    if (element.node) item = element.node
    if (element.relation) item = element.relation

    if (!item) return

    onItem(
      MetadataItem.fromObject({
        attribution: {
          source: AttributionSource.OpenStreetMap,
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
          amenity: item.tags?.amenity || '',
        },
      })
    )

    if (item.tags?.website) {
      onItem(
        MetadataItem.fromObject({
          attribution: {
            source: AttributionSource.OpenStreetMap,
            license: 'ODbL',
            url: item.id
              ? `https://www.openstreetmap.org/${Object.keys(element)[0]}/${item.id}`
              : 'https://www.openstreetmap.org/',
            name: String(item.id ?? 'OpenStreetMap'),
          },
          links: {
            list: [
              {
                url: item.tags.website,
              },
            ],
          },
        })
      )
    }

    if (item.tags?.opening_hours) {
      onItem(
        MetadataItem.fromObject({
          attribution: {
            source: AttributionSource.OpenStreetMap,
            license: 'ODbL',
            url: item.id
              ? `https://www.openstreetmap.org/${Object.keys(element)[0]}/${item.id}`
              : 'https://www.openstreetmap.org/',
            name: String(item.id ?? 'OpenStreetMap'),
          },
          openingHours: item.tags.opening_hours,
        })
      )
    }
  }

  private client = new OverpassClient()

  override handlesLocation(): boolean {
    return true // Handles all locations
  }

  public async getAreaMetadata(
    request: GetAreaMetadataInput,
    events: Emittery<Events>
  ): Promise<void> {
    const overpassResponse = this.client.ShortRangeNamed(
      QueryParameters.fromObject({
        coordinates: request.coordinates.toObject(),
        range: request.radiusMeters,
        tags: OverpassSource.requestedTags,
      })
    )

    const zone = IANAZone.create(Timezone.find(request.coordinates.lat, request.coordinates.lng)[0])

    const handleData = (response: Element) => {
      OverpassSource.processElement(response, zone, (item) => {
        events.emit('item', item)
      })
    }

    overpassResponse.on('data', handleData)

    overpassResponse.once('end', () => {
      overpassResponse.off('data', handleData)
    })
  }

  public getPoiMetadata(request: GetPoiMetadataInput, events: Emittery<Events>): Promise<void> {
    return new Promise((resolve, reject) => {
      const overpassResponse = this.client.PoiMetadata(
        PoiMetadataParameters.fromObject({
          ids: [request.id],
          tags: OverpassSource.requestedTags,
        })
      )

      const zone = request.coordinates
        ? IANAZone.create(Timezone.find(request.coordinates.lat, request.coordinates.lng)[0])
        : IANAZone.create('UTC')

      const handleData = (response: Element) => {
        OverpassSource.processElement(response, zone, (item) => {
          events.emit('item', item)
        })
      }

      overpassResponse.on('data', handleData)

      overpassResponse.once('end', () => {
        overpassResponse.off('data', handleData)
        resolve()
      })

      overpassResponse.once('error', (error: Error) => {
        overpassResponse.off('data', handleData)
        log.error(new VError(error, 'OverpassSource.getPoiMetadata'))
        reject(error)
      })
    })
  }
}
