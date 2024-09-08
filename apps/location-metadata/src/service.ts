import Emittery from 'emittery'
import type { sendUnaryData, ServerUnaryCall, ServerWritableStream } from '@grpc/grpc-js'

import { LocationMetadata } from '@project-maps/proto/location-metadata'
import type { LocationMetadataImages } from '@project-maps/proto/location-metadata/images'
import type { LocationMetadataOverpass } from '@project-maps/proto/location-metadata/overpass'

import type { Events, ImageSource } from 'src/declarations/source'
import { OverpassSource } from 'src/sources/overpass'
import { GeographUKImageSource } from 'src/sources/geograph-uk'

export class LocationMetadataService extends LocationMetadata.UnimplementedLocationMetadataService {
  private static imageSources = [new GeographUKImageSource()]

  private static metadataSources = [new OverpassSource()]

  private static aggregateImageSources = (
    imageSources: ImageSource[],
    request: LocationMetadataImages.GetLocationImagesRequest
  ): Emittery<Events> => {
    const events = new Emittery<Events>()

    const promises = imageSources.map((imageSource) => {
      const emitter = imageSource.getImages(request)

      const onImage = (image: LocationMetadataImages.LocationImage) => {
        events.emit('image', image)
      }

      const onEnd = () => {
        emitter.off('image', onImage)
        emitter.off('end', onEnd)

        const pending = promises.filter((promise) => promise !== emitter)

        if (pending.length === 0) {
          events.emit('end')
        }
      }

      emitter.on('image', onImage)
      emitter.on('end', onEnd)

      return emitter
    })

    return events
  }

  override GetLocationImages(
    call: ServerWritableStream<
      LocationMetadataImages.GetLocationImagesRequest,
      LocationMetadataImages.LocationImage
    >
  ): void {
    const events = LocationMetadataService.aggregateImageSources(LocationMetadataService.imageSources, call.request)

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

  override async GetLocationMetadata(
    call: ServerUnaryCall<
      LocationMetadataOverpass.GetLocationMetadataInput,
      LocationMetadataOverpass.GetLocationMetadataOutput
    >,
    callback: sendUnaryData<LocationMetadataOverpass.GetLocationMetadataOutput>
  ): Promise<void> {
    try {
      for (const source of LocationMetadataService.metadataSources) {
        if (source.handlesLocation(call.request.coordinates)) {
          const metadata = await source.getLocationMetadata(call.request)

          callback(null, metadata)

          return
        }
      }
    } catch (error) {
      console.error(error)

      if (error instanceof Error) {
        callback(new Error(`Cannot get location metadata: ${error.message}`))
      }
    }
  }
}
