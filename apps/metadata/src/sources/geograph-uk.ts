import type Emittery from 'emittery'

import { Metadata } from '@project-maps/proto/metadata'
import type { Geospatial } from '@project-maps/proto/lib/geospatial'

import { GeographClient } from 'src/clients/geograph'
import { config } from 'src/config'
import { MetadataSource, type Events } from 'src/declarations/metadata-source'
import VError from 'verror'

export class GeographUKImageSource extends MetadataSource {
  override handlesLocation(location: ReturnType<Geospatial.Coordinates['toObject']>): boolean {
    if (!location.lat || !location.lng) return false

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
    request: Metadata.GetAreaMetadataInput,
    events: Emittery<Events>
  ): Promise<void> {
    try {
      const parameters = request.toObject()

      const response = await this.client.syndicator({
        q: `${parameters.coordinates?.lat},${parameters.coordinates?.lng}`,
        perpage: 1,
        distance: (parameters.radiusMeters ?? 10) / 1000, // convert meters to kilometers
      })

      for (const item of response.items) {
        const details = await this.client.photo(item.guid)

        events.emit(
          'item',
          Metadata.MetadataItem.fromObject({
            attribution: {
              name: details.geograph.user['#text'],
              license: item.licence,
              url: `${config.clients.geographUK.baseUrl}/photo/${item.guid}`,
              source: Metadata.Attribution.Source.GeographUK,
            },
            image: {
              url: {
                canonical: details.geograph.img.src,
                small: details.geograph.thumbnail,
              },
              coordinates: {
                lat: Number.parseFloat(item.lat),
                lng: Number.parseFloat(item.long),
              },
              createdAt: {
                seconds: Math.floor(new Date(item.date).getTime() / 1000),
                nanos: 0,
              },
            },
          })
        )
      }

      events.emit('end')
    } catch (error) {
      if (error instanceof Error) {
        throw new VError(error, 'GeographUKImageSource.getAreaMetadata')
      }

      throw new Error('GeographUKImageSource.getAreaMetadata')
    }
  }

  public async getPoiMetadata(
    request: Metadata.GetPoiMetadataInput,
    events: Emittery<Events>
  ): Promise<void> {
    try {
      await this.getAreaMetadata(Metadata.GetAreaMetadataInput.fromObject({
        coordinates: request.coordinates,
        radiusMeters: 8,
      }), events)
    } catch (error) {
      if (error instanceof Error) {
        throw new VError(error, 'GeographUKImageSource.getPoiMetadata')
      }

      throw new Error('GeographUKImageSource.getPoiMetadata')
    }
  }
}
