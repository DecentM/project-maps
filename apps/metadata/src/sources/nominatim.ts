import type Emittery from 'emittery'
import VError from 'verror'

import { log } from '@project-maps/logging'
import { AttributionSource, MetadataItem } from '@project-maps/proto/metadata/node'

import { MetadataSource, type Events } from 'src/declarations/metadata-source'
import { type Nominatim } from 'src/clients/nominatim'

export class NominatimSource extends MetadataSource {
  constructor(private client: Nominatim) {
    super()
  }

  override listen(events: Emittery<Events>): () => void {
    const handleItem = async (data: MetadataItem) => {
      if (!data.has_coordinates) {
        return
      }

      events.emit('start')

      try {
        const response = await this.client.reverse({
          lat: String(data.coordinates.lat),
          lon: String(data.coordinates.lng!),
          addressdetails: 1,
        })

        if (!response.address) {
          events.emit('stop')
          return
        }

        events.emit(
          'metadata',
          MetadataItem.fromObject({
            attribution: {
              name: 'OpenStreetMap Nominatim',
              url: 'https://www.openstreetmap.org/copyright',
              license: response.licence,
              source: AttributionSource.Nominatim,
            },
            address: {
              city: response.address.city,
              state: response.address.state,
              country: response.address.country,
              postcode: response.address.postcode,
              housenumber: response.address.house_number,
              street: response.address.road,
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

    return () => {
      events.off('metadata', handleItem)
    }
  }
}
