import type Emittery from 'emittery'
import { DateTime } from 'luxon'

import {
  MetadataItem,
  GetAreaMetadataInput,
  AttributionSource,
  type GetPoiMetadataInput,
} from '@project-maps/proto/metadata/node'
import type { Coordinates } from '@project-maps/proto/lib/geospatial/node'

import { GeographClient } from 'src/clients/geograph'
import { config } from 'src/config'
import { MetadataSource, type Events } from 'src/declarations/metadata-source'
import VError from 'verror'
import { log } from '@project-maps/logging'

export class GeographUKImageSource extends MetadataSource {
  override handlesLocation(location: ReturnType<Coordinates['toObject']>): boolean {
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

  private client = new GeographClient(
    config.clients.geographUK.baseUrl,
    config.clients.geographUK.apiKey
  )

  public async getAreaMetadata(
    request: GetAreaMetadataInput,
    events: Emittery<Events>
  ): Promise<void> {
    try {
      const parameters = request.toObject()

      const response = await this.client.syndicator({
        q: `${parameters.coordinates?.lat},${parameters.coordinates?.lng}`,
        perpage: Math.min(Math.max(parameters.maxImages ?? 10, 1), 20),
        distance: (parameters.radiusMeters ?? 10) / 1000, // convert meters to kilometers
      })

      for (const item of response.items) {
        const details = await this.client.photo(item.guid)

        const downloadKey =
          details.geograph.img.src.split('/').pop()?.split('_')[1].split('.')[0] ?? ''

        const canonicalUrl = downloadKey
          ? `${config.clients.geographUK.baseUrl}/reuse.php?id=${item.guid}&download=${downloadKey}&size=original`
          : undefined

        events.emit(
          'item',
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
        throw new VError(error, 'GeographUKImageSource.getAreaMetadata')
      }

      throw new Error('GeographUKImageSource.getAreaMetadata')
    }
  }

  public async getPoiMetadata(
    request: GetPoiMetadataInput,
    events: Emittery<Events>
  ): Promise<void> {
    let foundCoordinates = false

    return new Promise((resolve, reject) => {
      events.once('overpass-end').then(() => {
        if (!foundCoordinates) resolve()
      })

      const handleItem = async (item: MetadataItem) => {
        if (!item.coordinates) {
          return
        }

        foundCoordinates = true
        events.off('item', handleItem)

        try {
          await this.getAreaMetadata(
            GetAreaMetadataInput.fromObject({
              coordinates: item.coordinates.toObject(),
              radiusMeters: 8,
              maxImages: Math.min(Math.max(request.maxImages ?? 10, 1), 20),
            }),
            events
          )
        } catch (error) {
          if (error instanceof Error) {
            log.error(new VError(error, 'GeographUKImageSource.getPoiMetadata'))
          }

          log.error(new Error('GeographUKImageSource.getPoiMetadata'))
        }

        resolve()
      }

      events.on('item', handleItem)
    })
  }
}
