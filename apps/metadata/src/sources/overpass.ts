import type Emittery from 'emittery'

import type { Element, Node, Way, Relation } from '@project-maps/proto/lib/openstreetmap/node'
import {
  AttributionSource,
  GetPoiMetadataInput,
  MetadataItem,
} from '@project-maps/proto/metadata/node'
import { PoiMetadataParameters } from '@project-maps/proto/overpass/node'

import { OverpassClient } from 'src/clients/overpass'
import { MetadataSource, type Events } from 'src/declarations/metadata-source'
import { log } from '@project-maps/logging'
import VError from 'verror'
import { parseAccess } from 'src/lib/parse-access'
import { parseIndoor } from 'src/lib/parse-indoor'
import { parseLocked } from 'src/lib/parse-locked'
import { parseOpeningHours } from 'src/lib/opening-hours'
import { maybeParseJsonString } from 'src/lib/maybe-parse-json-string'

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
            location: maybeParseJsonString(
              item.tags?.['defibrillator:location'] || item.tags?.['defibrillator:location:en']
            ),
            indoor: parseIndoor(item.tags?.indoor),
            phone: item.tags?.['emergency:phone'],
            code: item.tags?.['defibrillator:code'],
            locked: parseLocked(item.tags?.locked, item.tags?.['locked:conditional']),
            level: item.tags?.level ? Number.parseInt(item.tags.level, 10) : undefined,
            description: maybeParseJsonString(item.tags?.description),
            manufacturer: item.tags?.manufacturer,
            model: item.tags?.model,
            cabinet: item.tags?.cabinet,
          },
        })
      )
    }

    if (item.tags?.wikidata) {
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
          wikidataId: item.tags.wikidata,
        })
      )
    }

    if (item.tags?.['brand:wikidata']) {
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
          wikidataId: item.tags['brand:wikidata'],
        })
      )
    }

    if (item.tags?.['subject:wikidata']) {
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
          wikidataId: item.tags['subject:wikidata'],
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

    if (item.tags?.['contact:website']) {
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
                url: item.tags['contact:website'],
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

  private promisifyOverpassResponse(
    overpassResponse: NodeJS.ReadableStream,
    onItem: (item: MetadataItem) => void
  ): Promise<void> {
    const handleData = (response: Element) => {
      OverpassSource.processElement(response, onItem)
    }

    overpassResponse.on('data', handleData)

    return new Promise((resolve, reject) => {
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

  override listen(events: Emittery<Events>): () => void {
    const handleOsm = async (data: GetPoiMetadataInput) => {
      if (!data.id || !data.osmType) {
        return
      }

      events.emit('start')

      try {
        await this.promisifyOverpassResponse(
          this.client.PoiMetadata(
            PoiMetadataParameters.fromObject({
              id: data.id,
              type: data.osmType,
              tags: OverpassSource.requestedTags,
            })
          ),
          (item: MetadataItem) => events.emit('metadata', item)
        )
      } catch (error) {
        if (error instanceof Error) {
          log.error(new VError(error, 'OverpassSource.listen'))
        } else {
          log.error(new Error('OverpassSource.listen'))
        }
      }

      events.emit('stop')
    }

    events.on('osm', handleOsm)

    return () => {
      events.off('osm', handleOsm)
    }
  }
}
