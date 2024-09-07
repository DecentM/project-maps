import { LocationImages } from '@project-maps/proto/location-images'
import Emittery from 'emittery'

import { GeographClient } from 'src/clients/geograph'
import { config } from 'src/config'
import { ImageSource, type Events } from 'src/declarations/image-source'

export class GeographUKImageSource extends ImageSource {
  private client = new GeographClient(
    config.imageSources.geographUK.baseUrl,
    config.imageSources.geographUK.apiKey
  )

  getImages(request: LocationImages.GetLocationImagesRequest): Emittery<Events> {
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
            LocationImages.LocationImage.fromObject({
              url: details.geograph.img.src,
              thumbnailUrl: details.geograph.thumbnail,
              attribution: {
                name: details.geograph.user['#text'],
                license: item.licence,
                url: details.geograph.user.profile,
                source: LocationImages.ImageSource.GeographUK,
              },
              coordinates: {
                lat: item.lat,
                lng: item.long,
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
