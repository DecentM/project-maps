import type Emittery from 'emittery'

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
import { parseAccess } from 'src/lib/parse-access'
import { parseIndoor } from 'src/lib/parse-indoor'
import { parseLocked } from 'src/lib/parse-locked'
import { parseOpeningHours } from 'src/lib/opening-hours'

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
    'contact:website',
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
    'wikidata',
    'brand:wikidata',
    'subject:wikidata',
    'access',
    'defibrillator:location',
    'defibrillator:location:en',
    'emergency',
    'emergency:phone',
    'defibrillator:code',
    'indoor',
    'locked',
    'locked:conditional',
    'description',
    'manufacturer',
    'model',
  ]

  private static processElement(response: Element, onItem: (item: MetadataItem) => void): void {
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

    if (item.tags?.emergency === 'defibrillator') {
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
          defibrillator: {
            access: parseAccess(item.tags?.access),
            location:
              item.tags?.['defibrillator:location'] || item.tags?.['defibrillator:location:en'],
            indoor: parseIndoor(item.tags?.indoor),
            phone: item.tags?.['emergency:phone'],
            code: item.tags?.['defibrillator:code'],
            locked: parseLocked(item.tags?.locked, item.tags?.['locked:conditional']),
            level: item.tags?.level ? Number.parseInt(item.tags.level, 10) : undefined,
            description: item.tags?.description,
            manufacturer: item.tags?.manufacturer,
            model: item.tags?.model,
            cabinet: item.tags?.cabinet,
          },
        })
      )
    }

    if (item.tags?.wikidata || item.tags?.['brand:wikidata'] || item.tags?.['subject:wikidata']) {
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
          wikidataId:
            item.tags.wikidata || item.tags['brand:wikidata'] || item.tags['subject:wikidata'],
        })
      )
    }

    if (element.node?.lat && element.node?.lon) {
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
          coordinates: {
            lat: element.node.lat,
            lng: element.node.lon,
          },
        })
      )
    }

    if (item.tags?.website || item.tags?.['contact:website']) {
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
                url: item.tags.website || item.tags['contact:website'],
              },
            ],
          },
        })
      )
    }

    if (item.tags?.opening_hours) {
      const oh = parseOpeningHours(item.tags.opening_hours, {
        address: {
          country_code: item.tags?.['addr:country'] || '',
          state: item.tags?.['addr:state'] || '',
        },
        lat: element.node?.lat || 0,
        lon: element.node?.lon || 0,
      })

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
          openingHours: {
            fallback: item.tags.opening_hours || '',
            tz: oh?.tz,
            intervals: oh?.intervals.map((interval) => ({
              comment: interval.comment,
              uncertain: interval.uncertain,
              from: {
                millis: interval.from.toMillis(),
              },
              to: {
                millis: interval.to.toMillis(),
              },
            })),
            isCurrentlyOpen: oh?.isCurrentlyOpen,
            isWeekStable: oh?.isWeekStable,
            nextChange: {
              millis: oh?.nextChange?.toMillis(),
            },
            is247: oh?.is247,
          },
        })
      )
    }
  }

  private client = new OverpassClient()

  override handlesLocation(): boolean {
    return true // Handles all locations
  }

  public getAreaMetadata(request: GetAreaMetadataInput, events: Emittery<Events>): Promise<void> {
    return new Promise((resolve, reject) => {
      const overpassResponse = this.client.ShortRangeNamed(
        QueryParameters.fromObject({
          coordinates: request.coordinates.toObject(),
          range: request.radiusMeters,
          tags: OverpassSource.requestedTags,
        })
      )

      const handleData = (response: Element) => {
        OverpassSource.processElement(response, (item) => {
          events.emit('item', item)
        })
      }

      overpassResponse.on('data', handleData)

      overpassResponse.once('end', () => {
        overpassResponse.off('data', handleData)
        events.emit('overpass-end')
        resolve()
      })

      overpassResponse.once('error', (error: Error) => {
        overpassResponse.off('data', handleData)
        events.emit('overpass-end')
        log.error(new VError(error, 'OverpassSource.getPoiMetadata'))
        reject(error)
      })
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

      const handleData = (response: Element) => {
        OverpassSource.processElement(response, (item) => {
          events.emit('item', item)
        })
      }

      overpassResponse.on('data', handleData)

      overpassResponse.once('end', () => {
        overpassResponse.off('data', handleData)
        events.emit('overpass-end')
        resolve()
      })

      overpassResponse.once('error', (error: Error) => {
        overpassResponse.off('data', handleData)
        events.emit('overpass-end')
        log.error(new VError(error, 'OverpassSource.getPoiMetadata'))
        reject(error)
      })
    })
  }
}
