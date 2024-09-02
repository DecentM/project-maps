import type { ServerWritableStream } from '@grpc/grpc-js';
import { LocationImages } from '@project-maps/proto/dist/location-images';

export class LocationImagesService extends LocationImages.UnimplementedLocationImagesService {
  override GetLocationImages(call: ServerWritableStream<LocationImages.GetLocationImagesRequest, LocationImages.LocationImage>): void {

  }
}
