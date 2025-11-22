import type Emittery from 'emittery'
import VError from 'verror'

import { AttributionSource, MetadataItem } from '@project-maps/proto/metadata/node'
import { log } from '@project-maps/logging'

import type { TheIndependentClient } from 'src/clients/the-independent'
import { MetadataSource, type Events } from 'src/declarations/metadata-source'
import { nextTick } from 'src/lib/delay'

export class TheIndependentSource extends MetadataSource {
  constructor(private client: TheIndependentClient) {
    super()
  }

  override listen(events: Emittery<Events>): () => void {
    const handleItem = async (data: MetadataItem) => {
      if (
        !data.has_newsTopicReference ||
        data.newsTopicReference?.publisher !== AttributionSource.TheIndependent
      ) {
        return
      }

      events.emit('start')

      try {
        const topicId = data.newsTopicReference.id

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
                url: `https://www.independent.co.uk/${topic.id}.html`,
                name: `The Independent - ${topic.name}`,
                source: AttributionSource.TheIndependent,
              },
              newsItem: {
                id: article.id,
                title: article.title,
                description: article.description,
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
          log.error(new VError(error, 'TheIndependentSource.listen'))
        } else {
          log.error(new Error('TheIndependentSource.listen'))
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
