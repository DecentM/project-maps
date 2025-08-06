import type Emittery from 'emittery'
import VError from 'verror'

import { MetadataItem, AttributionSource } from '@project-maps/proto/metadata/node'
import { log } from '@project-maps/logging'

import { type Wikimapia } from 'src/clients/wikimapia'
import { MetadataSource, type Events } from 'src/declarations/metadata-source'

export class WikimapiaSource extends MetadataSource {
  constructor(private client: Wikimapia) {
    super()
  }

  override listen(events: Emittery<Events>): () => void {
    const handleItem = async (data: MetadataItem) => {
      if (!data.has_coordinates) {
        return
      }

      events.emit('start')

      try {
        const nearest = await this.client.Place_Getnearest({
          lat: data.coordinates.lat,
          lon: data.coordinates.lng,
          page: 1,
          count: 1,
        })

        if (!nearest.places || nearest.places.length === 0) {
          events.emit('stop')
          return
        }

        const place = await this.client.Place_Getbyid({
          id: nearest.places[0].id,
          data_blocks: 'location,photos,comments',
        })

        for (const photo of place.photos) {
          events.emit(
            'metadata',
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
            'metadata',
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
          log.error(new VError(error, 'WikimapiaSource.listen'))
        } else {
          log.error(new Error('WikimapiaSource.listen'))
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
