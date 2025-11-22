import type Emittery from 'emittery'
import VError from 'verror'

import { log } from '@project-maps/logging'
import {
  AttributionSource,
  GetPoiMetadataInput,
  MetadataItem,
} from '@project-maps/proto/metadata/node'

import { MetadataSource, type Events } from 'src/declarations/metadata-source'
import type { Nominatim, ReverseResult } from 'src/clients/nominatim'
import { MemberType } from '@project-maps/proto/lib/openstreetmap/node'
import { parseAccess } from 'src/lib/parse-access'
import { maybeParseJsonString } from 'src/lib/maybe-parse-json-string'
import { parseIndoor } from 'src/lib/parse-indoor'
import { parseLocked } from 'src/lib/parse-locked'
import { parseOpeningHours } from 'src/lib/opening-hours'
import { nextTick } from 'src/lib/delay'

export class NominatimSource extends MetadataSource {
  private static processElement(item: ReverseResult, onItem: (item: MetadataItem) => void): void {
    const attribution = {
      source: AttributionSource.OpenStreetMap,
      license: 'ODbL',
      url: item.osm_id
        ? `https://www.openstreetmap.org/${item.osm_type}/${item.osm_id}`
        : 'https://www.openstreetmap.org/',
      name: String(item.osm_id ?? 'OpenStreetMap'),
    }

    onItem(
      MetadataItem.fromObject({
        attribution,
        metadata: {
          name: item.extratags?.name || '',
          phone: item.extratags?.phone || '',
          amenity: item.extratags?.amenity || '',
        },
      })
    )

    if (
      item.extratags?.['addr:city'] ||
      item.extratags?.['addr:housenumber'] ||
      item.extratags?.['addr:postcode'] ||
      item.extratags?.['addr:state'] ||
      item.extratags?.['addr:street']
    )
      onItem(
        MetadataItem.fromObject({
          attribution,
          address: {
            city: item.extratags?.['addr:city'] || '',
            country: item.extratags?.['addr:country'] || '',
            housenumber: item.extratags?.['addr:housenumber'] || '',
            postcode: item.extratags?.['addr:postcode'] || '',
            state: item.extratags?.['addr:state'] || '',
            street: item.extratags?.['addr:street'] || '',
          },
        })
      )

    if (item.extratags?.emergency === 'defibrillator') {
      onItem(
        MetadataItem.fromObject({
          attribution,
          defibrillator: {
            access: parseAccess(item.extratags?.access),
            location: maybeParseJsonString(
              item.extratags?.['defibrillator:location'] ||
                item.extratags?.['defibrillator:location:en']
            ),
            indoor: parseIndoor(item.extratags?.indoor),
            phone: item.extratags?.['emergency:phone'],
            code: item.extratags?.['defibrillator:code'],
            locked: parseLocked(item.extratags?.locked, item.extratags?.['locked:conditional']),
            level: item.extratags?.level ? Number.parseInt(item.extratags.level, 10) : undefined,
            description: maybeParseJsonString(item.extratags?.description),
            manufacturer: item.extratags?.manufacturer,
            model: item.extratags?.model,
            cabinet: item.extratags?.cabinet,
          },
        })
      )
    }

    if (item.extratags?.wikidata) {
      onItem(
        MetadataItem.fromObject({
          attribution,
          wikidataId: item.extratags.wikidata,
        })
      )
    }

    if (item.extratags?.['brand:wikidata']) {
      onItem(
        MetadataItem.fromObject({
          attribution,
          wikidataId: item.extratags['brand:wikidata'],
        })
      )
    }

    if (item.extratags?.['subject:wikidata']) {
      onItem(
        MetadataItem.fromObject({
          attribution,
          wikidataId: item.extratags['subject:wikidata'],
        })
      )
    }

    if (item.extratags?.['operator:wikidata']) {
      onItem(
        MetadataItem.fromObject({
          attribution,
          wikidataId: item.extratags['operator:wikidata'],
        })
      )
    }

    if (item.lat && item.lon) {
      onItem(
        MetadataItem.fromObject({
          attribution,
          coordinates: {
            lat: Number.parseFloat(item.lat),
            lng: Number.parseFloat(item.lon),
          },
        })
      )
    }

    if (item.extratags?.website) {
      onItem(
        MetadataItem.fromObject({
          attribution,
          links: {
            list: [
              {
                url: item.extratags.website,
              },
            ],
          },
        })
      )
    }

    if (item.extratags?.['contact:website']) {
      onItem(
        MetadataItem.fromObject({
          attribution,
          links: {
            list: [
              {
                url: item.extratags['contact:website'],
              },
            ],
          },
        })
      )
    }

    if (item.extratags?.opening_hours && item.address) {
      const address = Object.assign({}, item.address, {
        road: item.extratags?.['addr:street'] || '',
        city: item.extratags?.['addr:city'] || '',
        state: item.extratags?.['addr:state'] || '',
        country: item.extratags?.['addr:country'] || '',
        postcode: item.extratags?.['addr:postcode'] || '',
        housenumber: item.extratags?.['addr:housenumber'] || '',
      })

      const oh = parseOpeningHours(item.extratags.opening_hours, {
        address,
        lat: Number.parseFloat(item.lat),
        lon: Number.parseFloat(item.lon),
      })

      onItem(
        MetadataItem.fromObject({
          attribution,
          openingHours: {
            fallback: item.extratags.opening_hours || '',
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

  constructor(private client: Nominatim) {
    super()
  }

  override listen(events: Emittery<Events>): () => void {
    const handleItem = async (data: MetadataItem) => {
      if (!data.has_coordinates || !data.coordinates) {
        return
      }

      events.emit('start')

      try {
        const nominatim = await this.client.reverse({
          lat: String(data.coordinates.lat),
          lon: String(data.coordinates.lng),
          addressdetails: 1,
        })

        if (!nominatim.address) {
          events.emit('stop')
          return
        }

        events.emit(
          'metadata',
          MetadataItem.fromObject({
            attribution: {
              name: 'OpenStreetMap Nominatim',
              url: 'https://www.openstreetmap.org/copyright',
              license: nominatim.licence,
              source: AttributionSource.Nominatim,
            },
            address: {
              city: nominatim.address.city,
              state: nominatim.address.state,
              country: nominatim.address.country,
              postcode: nominatim.address.postcode,
              housenumber: nominatim.address.house_number,
              street: nominatim.address.road,
            },
          })
        )
      } catch (error) {
        if (error instanceof Error) {
          log.error(new VError(error, 'NominatimSource.listen'))
        } else {
          log.error(new Error('NominatimSource.listen'))
        }
      }

      events.emit('stop')
    }

    events.on('metadata', handleItem)

    const handleOsm = async (data: GetPoiMetadataInput) => {
      if (!data.id || !data.osmType) {
        return
      }

      events.emit('start')

      try {
        const response = await this.client.lookup({
          osm_ids: [
            `${data.osmType === MemberType.MEMBER_TYPE_NODE ? 'N' : data.osmType === MemberType.MEMBER_TYPE_WAY ? 'W' : 'R'}${data.id}`,
          ],
          extratags: 1,
        })

        for (const item of response) {
          NominatimSource.processElement(item, (metadataItem) => {
            events.emit('metadata', metadataItem)
          })
        }
      } catch (error) {
        if (error instanceof Error) {
          log.error(new VError(error, 'NominatimSource.listen'))
        } else {
          log.error(new Error('NominatimSource.listen'))
        }
      }

      await nextTick()
      events.emit('stop')
    }

    events.on('osm', handleOsm)

    return () => {
      events.off('metadata', handleItem)
    }
  }
}
