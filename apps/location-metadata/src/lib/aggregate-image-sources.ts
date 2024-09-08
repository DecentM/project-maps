import type { LocationMetadataImages } from '@project-maps/proto/location-metadata/images'
import Emittery from 'emittery'
import type { Events, ImageSource } from 'src/declarations/image-source'

/**
 * Runs the getImages method on each image source and emits the images as they are received
 *
 * @param {ImageSource[]} imageSources The image sources to aggregate
 * @param {GetLocationImagesRequest} request The request to pass to each image source
 * @returns {Emittery<Events>} An emitter that emits the images as they are received
 */
export const aggregateImageSources = (
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
