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
        perpage: 1,
      })
      .then(async (response) => {
        for (const item of response.items) {
          const details = await this.client.photo(item.guid)

          events.emit(
            'image',
            LocationImages.LocationImage.fromObject({
              url: details.geograph.img.src,
              thumbnailUrl: details.geograph.thumbnail,
              source: LocationImages.ImageSource.GeographUK,
              attribution: details.geograph.user['#text'],
              attributionUrl: details.geograph.user.profile,
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

    return events
  }
}
