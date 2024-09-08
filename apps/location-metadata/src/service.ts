import type { sendUnaryData, ServerUnaryCall, ServerWritableStream } from '@grpc/grpc-js'
import { LocationMetadata } from '@project-maps/proto/location-metadata'
import { aggregateImageSources } from './lib/aggregate-image-sources'
import { GeographUKImageSource } from './image-sources/geograph-uk'
import type { LocationMetadataImages } from '@project-maps/proto/location-metadata/images'
import { LocationMetadataOverpass } from '@project-maps/proto/location-metadata/overpass'

const imageSources = [new GeographUKImageSource()]

export class LocationMetadataService extends LocationMetadata.UnimplementedLocationMetadataService {
  override GetLocationImages(
    call: ServerWritableStream<
      LocationMetadataImages.GetLocationImagesRequest,
      LocationMetadataImages.LocationImage
    >
  ): void {
    const events = aggregateImageSources(imageSources, call.request)

    const onImage = (image: LocationMetadataImages.LocationImage) => {
      call.write(image)
    }

    const onEnd = () => {
      events.off('image', onImage)
      events.off('end', onEnd)

      call.end()
    }

    events.on('image', onImage)
    events.on('end', onEnd)
  }

  override GetLocationMetadata(
    call: ServerUnaryCall<
      LocationMetadataOverpass.GetLocationMetadataInput,
      LocationMetadataOverpass.GetLocationMetadataOutput
    >,
    callback: sendUnaryData<LocationMetadataOverpass.GetLocationMetadataOutput>
  ): void {
    // Implement the service method here
    callback(null, LocationMetadataOverpass.GetLocationMetadataOutput.fromObject({
      name: 'Test',
      address: {
        street: 'Test Street',
        city: 'Test City',
        country: 'Test Country',
        postcode: '00000',
        housenumber: '0'
      },
      phone: '0000000000',
      website: 'https://example.com',
    }))
  }
}
