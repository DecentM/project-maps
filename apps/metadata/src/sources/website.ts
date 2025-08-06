import type Emittery from 'emittery'
import { JSDOM } from 'jsdom'

import { AttributionSource, MetadataItem } from '@project-maps/proto/metadata/node'

import { MetadataSource, type Events } from 'src/declarations/metadata-source'
import VError from 'verror'
import { log } from '@project-maps/logging'

import { WebsiteClient } from 'src/clients/website'

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
  private static fixupUrl(url: string): string {
    if (url.startsWith('https://')) {
      return url
    }

    if (!url.startsWith('http')) {
      return `http://${url}`
    }

    return url
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

      if (!('@type' in graph) || graph['@type'] !== 'WebPage') {
        return undefined
      }

      const source = new URL(WebsiteSource.fixupUrl(url))

      for (const item of graph['@graph'] || []) {
        switch (item['@type']) {
          case 'ImageObject':
            onItem(
              MetadataItem.fromObject({
                attribution: {
                  source: AttributionSource.Website,
                  name: source.hostname,
                  license: undefined,
                  url: source.href,
                },
                image: {
                  url: {
                    canonical: item.contentUrl,
                  },
                },
              })
            )
            break

          case 'Organization': {
            if (item.logo?.contentUrl) {
              onItem(
                MetadataItem.fromObject({
                  attribution: {
                    source: AttributionSource.Website,
                    name: item.name || source.hostname,
                    license: undefined,
                    url: item.url || source.href,
                  },
                  logo: {
                    canonical: item.logo?.contentUrl,
                  },
                })
              )
            }

            if (item.image?.url) {
              onItem(
                MetadataItem.fromObject({
                  attribution: {
                    source: AttributionSource.Website,
                    name: item.name || source.hostname,
                    license: undefined,
                    url: item.url || source.href,
                  },
                  image: {
                    url: {
                      canonical: item.image?.url,
                    },
                  },
                })
              )
            }
            break
          }
        }
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

  private static async processLink(
    url: string,
    onItem: (data: MetadataItem) => void
  ): Promise<void> {
    const client = new WebsiteClient(url)
    const html = await client.getText()

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

          await WebsiteSource.processLink(url.href, onItem)
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
