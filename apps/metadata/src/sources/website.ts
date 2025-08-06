import type Emittery from 'emittery'
import { JSDOM } from 'jsdom'

import { AttributionSource, MetadataItem } from '@project-maps/proto/metadata/node'

import { MetadataSource, type Events } from 'src/declarations/metadata-source'
import VError from 'verror'
import { log } from '@project-maps/logging'

import { type Website } from 'src/clients/website'

const createBlacklist = () => [
  /^([a-z]{0,2}\.)?wikipedia.org/giu,
  /^instagram.com/giu,
  /^facebook.com/giu,
  /^x.com/giu,
  /^linkedin.com/giu,
  /^pinterest.com/giu,
  /^(www\.)?bbc.co.uk/giu,
]

export class WebsiteSource extends MetadataSource {
  constructor(private client: Website) {
    super()
  }

  private static fixupUrl(url: string): string {
    if (url.startsWith('https://')) {
      return url
    }

    if (!url.startsWith('http')) {
      return `http://${url}`
    }

    return url
  }

  private static processLDJsonFragment(
    item: unknown,
    source: URL,
    onItem: (data: MetadataItem) => void
  ): void {
    if (typeof item !== 'object' || item === null || !('@type' in item)) {
      return
    }

    switch (item['@type']) {
      case 'WebPage':
        if ('description' in item && typeof item.description === 'string')
          onItem(
            MetadataItem.fromObject({
              attribution: {
                source: AttributionSource.Website,
                name: source.hostname,
                license: undefined,
                url: source.href,
              },
              description: {
                text: item.description,
              },
            })
          )

        if ('thumbnailUrl' in item && typeof item.thumbnailUrl === 'string')
          onItem(
            MetadataItem.fromObject({
              attribution: {
                source: AttributionSource.Website,
                name: source.hostname,
                license: undefined,
                url: source.href,
              },
              logo: {
                small: item.thumbnailUrl,
              },
            })
          )

        break

      case 'ImageObject':
        if (
          ('contentUrl' in item && typeof item.contentUrl === 'string') ||
          ('url' in item && typeof item.url === 'string')
        ) {
          const url = ('contentUrl' in item ? item.contentUrl : 'url' in item ? item.url : '') as
            | string
            | undefined

          onItem(
            url?.includes('logo')
              ? MetadataItem.fromObject({
                  attribution: {
                    source: AttributionSource.Website,
                    name: source.hostname,
                    license: undefined,
                    url: source.href,
                  },
                  logo: {
                    canonical: url,
                  },
                })
              : MetadataItem.fromObject({
                  attribution: {
                    source: AttributionSource.Website,
                    name: source.hostname,
                    license: undefined,
                    url: source.href,
                  },
                  image: {
                    url: {
                      canonical: url,
                    },
                  },
                })
          )
        }
        break

      case 'Organization': {
        if ('logo' in item) WebsiteSource.processLDJsonFragment(item.logo, source, onItem)
        if ('image' in item) WebsiteSource.processLDJsonFragment(item.image, source, onItem)

        break
      }
    }
  }

  private static processLDJson(
    dom: DocumentFragment,
    url: string,
    onItem: (data: MetadataItem) => void
  ): undefined {
    try {
      const ldGraph = dom.querySelector('script[type="application/ld+json"]')

      if (!ldGraph || !ldGraph.textContent) {
        return undefined
      }

      const graph = JSON.parse(ldGraph.textContent)

      if (!('@graph' in graph) || !Array.isArray(graph['@graph'])) {
        return undefined
      }

      const source = new URL(WebsiteSource.fixupUrl(url))

      for (const item of graph['@graph'] || []) {
        WebsiteSource.processLDJsonFragment(item, source, onItem)
      }
    } catch (error) {
      if (error instanceof Error) {
        log.error(new VError(error, 'Failed to parse JSON-LD'))
      } else {
        log.error(new Error('Failed to parse JSON-LD'))
      }
    }
  }

  private static processOpenGraph(
    dom: DocumentFragment,
    url: string,
    onItem: (data: MetadataItem) => void
  ): void {
    const ogUrl =
      dom.querySelector('meta[property="og:url"]') || dom.querySelector('meta[name="og:url"]')
    const ogImage =
      dom.querySelector('meta[property="og:image"]') || dom.querySelector('meta[name="og:image"]')

    const source = new URL(WebsiteSource.fixupUrl(url))
    const imageUrl = ogImage?.getAttribute('content') || ogImage?.getAttribute('value')

    if (imageUrl) {
      onItem(
        imageUrl.includes('logo')
          ? MetadataItem.fromObject({
              attribution: {
                source: AttributionSource.Website,
                name: source.hostname,
                license: undefined,
                url: ogUrl?.getAttribute('content') || source.href,
              },
              logo: {
                canonical: imageUrl,
              },
            })
          : MetadataItem.fromObject({
              attribution: {
                source: AttributionSource.Website,
                name: source.hostname,
                license: undefined,
                url: ogUrl?.getAttribute('content') || source.href,
              },
              image: {
                url: {
                  canonical: imageUrl,
                },
              },
            })
      )
    }

    const ogDescription = dom.querySelector('meta[property="og:description"]')

    if (ogDescription) {
      onItem(
        MetadataItem.fromObject({
          attribution: {
            source: AttributionSource.Website,
            name: source.hostname,
            license: undefined,
            url: ogUrl?.getAttribute('content') || source.href,
          },
          description: {
            text: ogDescription.getAttribute('content') || '',
          },
        })
      )
    }
  }

  private async processLink(url: string, onItem: (data: MetadataItem) => void): Promise<void> {
    const html = await this.client.getText(url)

    if (!html) {
      return
    }

    const dom = JSDOM.fragment(html)

    WebsiteSource.processOpenGraph(dom, url, onItem)
    WebsiteSource.processLDJson(dom, url, onItem)
  }

  override listen(events: Emittery<Events>): () => void {
    const onItem = (data: MetadataItem) => {
      events.emit('metadata', data)
    }

    const processedLinks = new Set<string>()

    const handleItem = async (data: MetadataItem) => {
      if (!data.has_links) {
        return
      }

      events.emit('start')

      try {
        for (const link of data.links.list) {
          const url = new URL(WebsiteSource.fixupUrl(link.url))
          const blacklist = createBlacklist()

          if (blacklist.some((pattern) => pattern.test(url.hostname))) {
            continue
          }

          if (processedLinks.has(url.href)) {
            continue
          }

          processedLinks.add(url.href)

          await this.processLink(url.href, onItem)
        }
      } catch (error) {
        if (error instanceof Error) {
          log.error(new VError(error, 'WebsiteSource.listen'))
        } else {
          log.error(new Error('WebsiteSource.listen'))
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
