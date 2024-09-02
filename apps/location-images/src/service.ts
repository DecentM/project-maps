import type { ServerWritableStream } from '@grpc/grpc-js';
import { LocationImages } from '@project-maps/proto/location-images';
import { aggregateImageSources } from './lib/aggregate-image-sources';
import { GeographUKImageSource } from './image-sources/geograph-uk';

const imageSources = [
  new GeographUKImageSource(),
]

export class LocationImagesService extends LocationImages.UnimplementedLocationImagesService {
  override GetLocationImages(call: ServerWritableStream<LocationImages.GetLocationImagesRequest, LocationImages.LocationImage>): void {
    const events = aggregateImageSources(imageSources, call.request);

    const onImage = (image: LocationImages.LocationImage) => {
      call.write(image);
    }

    const onEnd = () => {
      events.off('image', onImage);
      events.off('end', onEnd);

      call.end();
    }

    events.on('image', onImage);
    events.on('end', onEnd);
  }
}
