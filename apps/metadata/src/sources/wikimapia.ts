import type Emittery from 'emittery'

import { Metadata } from '@project-maps/proto/metadata'
import type { Geospatial } from '@project-maps/proto/lib/geospatial'

import { WikimapiaClient } from 'src/clients/wikimapia'
import { config } from 'src/config'
import { MetadataSource, type Events } from 'src/declarations/metadata-source'

export class WikimapiaSource extends MetadataSource {
  private client = new WikimapiaClient(
    config.clients.wikimapia.baseUrl,
    config.clients.wikimapia.apiKey
  )

  override handlesLocation(coordinates: Geospatial.Coordinates): boolean {
    return true // Handles all locations
  }

  public async getAreaMetadata(params: Metadata.GetAreaMetadataInput, events: Emittery<Events>): Promise<void> {
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
      events.emit('item', Metadata.AreaMetadataItem.fromObject({
        attribution: {
          source: Metadata.Attribution.Source.Wikimapia,
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
        }
      }))
    }

    for (const comment of place.comments) {
      events.emit('item', Metadata.AreaMetadataItem.fromObject({
        attribution: {
          source: Metadata.Attribution.Source.Wikimapia,
          license: 'CC-BY SA',
          name: comment.name,
          url: `https://wikimapia.org/user/${comment.user_id}`,
        },
        comment: {
          author: {
            name: comment.name,
            avatarUrl: comment.user_photo ? `https://wikimapia.org/${comment.user_photo}` : 'https://wikimapia.org/img/nofoto_50.png',
            profileUrl: `https://wikimapia.org/user/${comment.user_id}`,
          },
          text: comment.message,
          createdAt: {
            seconds: comment.date,
          },
          replies: [],
        }
      }))
    }

    events.emit('end')
  }
}
