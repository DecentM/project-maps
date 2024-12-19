import type Emittery from 'emittery'

import {
  GetAreaMetadataInput,
  type GetPoiMetadataInput,
  MetadataItem,
  AttributionSource,
} from '@project-maps/proto/metadata'
import type { Coordinates } from '@project-maps/proto/lib/geospatial'

import { WikimapiaClient } from 'src/clients/wikimapia'
import { config } from 'src/config'
import { MetadataSource, type Events } from 'src/declarations/metadata-source'
import VError from 'verror'

export class WikimapiaSource extends MetadataSource {
  private client = new WikimapiaClient(
    config.clients.wikimapia.baseUrl,
    config.clients.wikimapia.apiKey
  )

  override handlesLocation(coordinates: Coordinates): boolean {
    return true // Handles all locations
  }

  public async getAreaMetadata(
    params: GetAreaMetadataInput,
    events: Emittery<Events>
  ): Promise<void> {
    try {
      const nearest = await this.client.Place_Getnearest({
        lat: params.coordinates.lat,
        lon: params.coordinates.lng,
        page: 1,
        count: 1,
      })

      if (!nearest.places || nearest.places.length === 0) {
        events.emit('end')
        return
      }

      const place = await this.client.Place_Getbyid({
        id: nearest.places[0].id,
        data_blocks: 'location,photos,comments',
      })

      for (const photo of place.photos) {
        events.emit(
          'item',
          MetadataItem.fromObject({
            attribution: {
              source: AttributionSource.Wikimapia,
              license: 'CC-BY SA',
              name: photo.user_name,
              url: `https://wikimapia.org/user/${photo.user_id}`,
            },
            image: {
              url: {
                canonical: photo.big_url,
                small: photo.thumbnail_url,
                medium: photo['960_url'],
                large: photo['1280_url'],
              },
              createdAt: {
                seconds: photo.time,
              },
            },
          })
        )
      }

      for (const comment of place.comments) {
        events.emit(
          'item',
          MetadataItem.fromObject({
            attribution: {
              source: AttributionSource.Wikimapia,
              license: 'CC-BY SA',
              name: comment.name,
              url: `https://wikimapia.org/user/${comment.user_id}`,
            },
            comment: {
              author: {
                name: comment.name,
                avatarUrl: comment.user_photo
                  ? `https://wikimapia.org/${comment.user_photo}`
                  : 'https://wikimapia.org/img/nofoto_50.png',
                profileUrl: `https://wikimapia.org/user/${comment.user_id}`,
              },
              text: comment.message,
              createdAt: {
                seconds: comment.date,
              },
              replies: [],
            },
          })
        )
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new VError(error, 'WikimapiaSource.getAreaMetadata')
      }

      throw new Error('WikimapiaSource.getAreaMetadata')
    } finally {
      events.emit('end')
    }
  }

  override async getPoiMetadata(
    request: GetPoiMetadataInput,
    events: Emittery<Events>
  ): Promise<void> {
    try {
      await this.getAreaMetadata(
        GetAreaMetadataInput.fromObject({
          coordinates: request.coordinates,
        }),
        events
      )
    } catch (error) {
      if (error instanceof Error) {
        throw new VError(error, 'WikimapiaSource.getPoiMetadata')
      }

      throw new Error('WikimapiaSource.getPoiMetadata')
    } finally {
      events.emit('end')
    }
  }
}
