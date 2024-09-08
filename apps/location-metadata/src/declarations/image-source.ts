import type Emittery from 'emittery'
import type { LocationMetadataImages } from '@project-maps/proto/location-metadata/images'

export type Events = {
  image: LocationMetadataImages.LocationImage
  end: undefined
}

export abstract class ImageSource {
  abstract getImages(request: LocationMetadataImages.GetLocationImagesRequest): Emittery<Events>
}
