import type Emittery from 'emittery'
import VError from 'verror'

import {
  GetAreaMetadataInput,
  MetadataItem,
  AttributionSource,
  type GetPoiMetadataInput,
} from '@project-maps/proto/metadata/node'
import type { Coordinates } from '@project-maps/proto/lib/geospatial/node'

import { MapillaryClient } from 'src/clients/mapillary'
import { config } from 'src/config'
import { MetadataSource, type Events } from 'src/declarations/metadata-source'
import { createBBox } from 'src/lib/bbox'
export class MapillarySource extends MetadataSource {
  override handlesLocation(location: ReturnType<Coordinates['toObject']>): boolean {
    return true // Handles all locations
  }

  private client = new MapillaryClient(
    config.clients.mapillary.baseUrl,
    config.clients.mapillary.apiKey
  )

  public async getAreaMetadata(
    request: GetAreaMetadataInput,
    events: Emittery<Events>
  ): Promise<void> {
    try {
      const parameters = request.toObject()

      if (
        !parameters.coordinates?.lat ||
        !parameters.coordinates?.lng ||
        !parameters.radiusMeters
      ) {
        return
      }

      const bbox = createBBox(
        { lat: parameters.coordinates.lat!, lng: parameters.coordinates.lng! },
        parameters.radiusMeters
      )

      const images = await this.client.images({
        bbox: `${bbox[0].lng},${bbox[0].lat},${bbox[1].lng},${bbox[1].lat}`,
        limit: 1,
      })

      for (const image of images.data) {
        const imageData = await this.client.image({
          id: image.id,
          fields:
            'captured_at,creator,thumb_256_url,thumb_1024_url,thumb_2048_url,thumb_original_url',
        })

        events.emit(
          'item',
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
        throw new VError(error, 'MapillarySource.getAreaMetadata')
      }

      throw new Error('MapillarySource.getAreaMetadata')
    }
  }

  public async getPoiMetadata(
    request: GetPoiMetadataInput,
    events: Emittery<Events>
  ): Promise<void> {
    try {
      await this.getAreaMetadata(
        GetAreaMetadataInput.fromObject({
          coordinates: request.coordinates,
          radiusMeters: 6,
        }),
        events
      )
    } catch (error) {
      if (error instanceof Error) {
        throw new VError(error, 'MapillarySource.getPoiMetadata')
      }

      throw new Error('MapillarySource.getPoiMetadata')
    }
  }
}
