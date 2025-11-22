import type Emittery from 'emittery'
import VError from 'verror'

import { AttributionSource, MetadataItem } from '@project-maps/proto/metadata/node'
import { log } from '@project-maps/logging'

import type { BBCClient } from 'src/clients/bbc'
import { MetadataSource, type Events } from 'src/declarations/metadata-source'
import { nextTick } from 'src/lib/delay'

export class BBCSource extends MetadataSource {
  constructor(private client: BBCClient) {
    super()
  }

  override listen(events: Emittery<Events>): () => void {
    const handleItem = async (data: MetadataItem) => {
      const topicUrl = data.links?.list.find((link) => link.url.includes('bbc.co.uk/news/topics/'))

      if (!topicUrl) {
        return
      }

      events.emit('start')

      try {
        const topicId = topicUrl.url.split('/').pop()

        if (!topicId) {
          events.emit('stop')
          return
        }

        const topic = await this.client.getRecentArticles(topicId)

        if (!topic) {
          events.emit('stop')
          return
        }

        for (const article of topic.articles) {
          if (!article.publishedAt) {
            continue
          }

          events.emit(
            'metadata',
            MetadataItem.fromObject({
              attribution: {
                license: 'Unspecified',
                url: topicUrl.url,
                name: `BBC News - ${topic.name}`,
                source: AttributionSource.BBC,
              },
              newsItem: {
                id: article.id,
                title: article.title,
                blurb: article.blurb,
                url: article.url,
                thumbnail: {
                  src: article.thumbnailUrl || '',
                  srcset: article.thumbnailSrcSet || '',
                },
                publishedAt: article.publishedAt
                  ? { millis: article.publishedAt.getTime() }
                  : undefined,
              },
            })
          )
        }
      } catch (error) {
        if (error instanceof Error) {
          log.error(new VError(error, 'BBCSource.listen'))
        } else {
          log.error(new Error('BBCSource.listen'))
        }
      }

      await nextTick()
      events.emit('stop')
    }

    events.on('metadata', handleItem)

    return () => {
      events.off('metadata', handleItem)
    }
  }
}
