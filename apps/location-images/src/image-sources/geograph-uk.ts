import { LocationImages } from '@project-maps/proto/location-images'
import Emittery from 'emittery'
import { GeographClient } from 'src/clients/geograph'
import { config } from 'src/config'
import { ImageSource, type Events } from 'src/declarations/image-source'

export class GeographUKImageSource extends ImageSource {
  private client = new GeographClient(config.imageSources.geographUK.baseUrl, config.imageSources.geographUK.apiKey)

  getImages(request: LocationImages.GetLocationImagesRequest): Emittery<Events> {
    const events = new Emittery<Events>()
    const parameters = request.toObject()

    this.client.syndicator({ q: `${parameters.coordinates?.lat},${parameters.coordinates?.lng}` })
      .then(response => {
        for (const item of response.items) {
          events.emit('image', LocationImages.LocationImage.fromObject({
            url: item.link,
            thumbnailUrl: item.thumb,
            source: LocationImages.ImageSource.GeographUK,
            attribution: item.author,
            attributionUrl: item.link,
            coordinates: {
              lat: item.lat,
              lng: item.long,
            },
            createdAt: {
              seconds: Math.floor(new Date(item.date).getTime() / 1000),
              nanos: 0,
            },
            downloadable: true,
          }))
        }
      })

    return events
  }
}
