import type Emittery from 'emittery'
import VError from 'verror'

import { MetadataItem, AttributionSource } from '@project-maps/proto/metadata/node'
import { log } from '@project-maps/logging'

import { MapillaryClient } from 'src/clients/mapillary'
import { config } from 'src/config'
import { MetadataSource, type Events } from 'src/declarations/metadata-source'
import { createBBox } from 'src/lib/bbox'
export class MapillarySource extends MetadataSource {
  private client = new MapillaryClient(
    config.clients.mapillary.baseUrl,
    config.clients.mapillary.apiKey
  )

  override listen(events: Emittery<Events>): () => void {
    const handleItem = async (data: MetadataItem) => {
      if (!data.has_coordinates) {
        return
      }

      events.emit('start')

      try {
        const bbox = createBBox({ lat: data.coordinates.lat, lng: data.coordinates.lng! }, 8)

        const images = await this.client.images({
          bbox: `${bbox[0].lng},${bbox[0].lat},${bbox[1].lng},${bbox[1].lat}`,
          limit: 2,
        })

        for (const image of images.data) {
          const imageData = await this.client.image({
            id: image.id,
            fields:
              'captured_at,creator,thumb_256_url,thumb_1024_url,thumb_2048_url,thumb_original_url',
          })

          events.emit(
            'metadata',
            MetadataItem.fromObject({
              attribution: {
                license: 'CC BY-SA',
                source: AttributionSource.Mapillary,
                name: imageData.creator?.username,
                url: `https://mapillary.com/app/user/${imageData.creator?.username}?pKey=${imageData.id}&focus=photo`,
              },
              image: {
                coordinates: {
                  lat: image.geometry.coordinates[1],
                  lng: image.geometry.coordinates[0],
                },
                createdAt: {
                  seconds: Math.floor(imageData.captured_at ?? 0 / 1000),
                },
                url: {
                  canonical: imageData.thumb_original_url,
                  small: imageData.thumb_256_url,
                  medium: imageData.thumb_1024_url,
                  large: imageData.thumb_2048_url,
                },
              },
            })
          )
        }
      } catch (error) {
        if (error instanceof Error) {
          log.error(new VError(error, 'MapillarySource.listen'))
        } else {
          log.error(new Error('MapillarySource.listen'))
        }
      }

      events.emit('stop')
    }

    events.on('metadata', handleItem)

    return () => {
      events.off('metadata', handleItem)
    }
  }
}
