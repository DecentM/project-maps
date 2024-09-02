import type Emittery from 'emittery'
import type { LocationImages } from '@project-maps/proto/location-images'

export type Events = {
  image: LocationImages.LocationImage
  end: undefined
}

export abstract class ImageSource {
  abstract getImages(request: LocationImages.GetLocationImagesRequest): Emittery<Events>
}
