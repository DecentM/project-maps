import type Emittery from 'emittery'
import type { LocationMetadataImages } from '@project-maps/proto/location-metadata/images'
import type { Geospatial } from '@project-maps/proto/lib/geospatial'

export type Events = {
  image: LocationMetadataImages.LocationImage
  end: undefined
}

export abstract class Source {
  abstract handlesLocation(location: ReturnType<typeof Geospatial.Coordinates['toObject']>): boolean
}

export abstract class ImageSource extends Source {
  abstract getImages(request: LocationMetadataImages.GetLocationImagesRequest): Emittery<Events>
}
