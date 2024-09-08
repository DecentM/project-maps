import type { Geospatial } from '@project-maps/proto/lib/geospatial'
import { LocationMetadataImages } from '@project-maps/proto/location-metadata/images'
import Emittery from 'emittery'

import { GeographClient } from 'src/clients/geograph'
import { config } from 'src/config'
import { ImageSource, type Events } from 'src/declarations/source'

export class GeographUKImageSource extends ImageSource {
  override handlesLocation(location: ReturnType<Geospatial.Coordinates['toObject']>): boolean {
    if (!location.lat || !location.lng) return false

    // Geograph UK only supports locations within the UK
    // TODO: Proper bbox implementation (probably using a library)
    return location.lat >= 49.86 && location.lat <= 60.86 && location.lng >= -8.65 && location.lng <= 1.77
  }

  private client = new GeographClient(
    config.clients.geographUK.baseUrl,
    config.clients.geographUK.apiKey
  )

  getImages(request: LocationMetadataImages.GetLocationImagesRequest): Emittery<Events> {
    const events = new Emittery<Events>()
    const parameters = request.toObject()

    this.client
      .syndicator({
        q: `${parameters.coordinates?.lat},${parameters.coordinates?.lng}`,
        perpage: parameters.pagination?.limit ?? 1,
        distance: (parameters.radiusMeters ?? 10) / 1000, // convert meters to kilometers
      })
      .then(async (response) => {
        for (const item of response.items) {
          const details = await this.client.photo(item.guid)

          events.emit(
            'image',
            LocationMetadataImages.LocationImage.fromObject({
              url: details.geograph.img.src,
              thumbnailUrl: details.geograph.thumbnail,
              attribution: {
                name: details.geograph.user['#text'],
                license: item.licence,
                url: details.geograph.user.profile,
                source: LocationMetadataImages.ImageSource.GeographUK,
              },
              coordinates: {
                lat: Number.parseFloat(item.lat),
                lng: Number.parseFloat(item.long),
              },
              createdAt: {
                seconds: Math.floor(new Date(item.date).getTime() / 1000),
                nanos: 0,
              },
              downloadable: true,
            })
          )
        }
      })
      .then(() => events.emit('end'))
      .catch((error) => console.error(error))

    return events
  }
}
