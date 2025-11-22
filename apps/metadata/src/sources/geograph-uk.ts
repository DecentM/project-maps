import type Emittery from 'emittery'
import { DateTime } from 'luxon'

import { MetadataItem, AttributionSource } from '@project-maps/proto/metadata/node'
import type { Coordinates } from '@project-maps/proto/lib/geospatial/node'

import { type Geograph } from 'src/clients/geograph'
import { config } from 'src/config'
import { MetadataSource, type Events } from 'src/declarations/metadata-source'
import VError from 'verror'
import { log } from '@project-maps/logging'
import { nextTick } from 'src/lib/delay'

export class GeographUKImageSource extends MetadataSource {
  constructor(private client: Geograph) {
    super()
  }

  private handlesLocation(location: Coordinates): boolean {
    if (!location || !location.lat || !location.lng) return false

    // Geograph UK only supports locations within the UK
    // TODO: Proper bbox implementation (probably using a library)
    return (
      location.lat >= 49.86 &&
      location.lat <= 60.86 &&
      location.lng >= -8.65 &&
      location.lng <= 1.77
    )
  }

  override listen(events: Emittery<Events>): () => void {
    const handleItem = async (data: MetadataItem) => {
      if (!data.has_coordinates) {
        return
      }

      if (!this.handlesLocation(data.coordinates)) {
        return
      }

      events.emit('start')

      try {
        const response = await this.client.syndicator({
          q: `${data.coordinates.lat},${data.coordinates.lng}`,
          perpage: 5,
          distance: 8 / 1000, // convert meters to kilometers
        })

        for (const item of response.items) {
          const details = await this.client.photo(item.guid)

          const downloadKey =
            details.geograph.img.src.split('/').pop()?.split('_')[1].split('.')[0] ?? ''

          const canonicalUrl = downloadKey
            ? `${config.clients.geographUK.baseUrl}/reuse.php?id=${item.guid}&download=${downloadKey}&size=original`
            : undefined

          events.emit(
            'metadata',
            MetadataItem.fromObject({
              attribution: {
                name: details.geograph.user['#text'],
                license: item.licence,
                url: item.link,
                source: AttributionSource.GeographUK,
              },
              image: {
                url: {
                  canonical: canonicalUrl,
                  medium: details.geograph.img.src,
                  small: details.geograph.thumbnail,
                },
                coordinates: {
                  lat: Number.parseFloat(item.lat),
                  lng: Number.parseFloat(item.long),
                },
                createdAt: {
                  seconds: Math.round(DateTime.fromMillis(item.date).toSeconds()),
                },
              },
            })
          )
        }
      } catch (error) {
        if (error instanceof Error) {
          log.error(new VError(error, 'GeographUKImageSource.listen'))
        } else {
          log.error(new Error('GeographUKImageSource.listen'))
        }
      }

      await nextTick()
      events.emit('stop')
    }

    events.on('metadata', handleItem)

    return () => {
      events.off('metadata', handleItem)
    }
  }
}
