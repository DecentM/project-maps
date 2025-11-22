import type Emittery from 'emittery'
import { isEntityId, type SimplifiedEntity } from 'wikibase-sdk'

import { MetadataItem, AttributionSource } from '@project-maps/proto/metadata/node'

import { type Wikidata } from 'src/clients/wikidata'
import { MetadataSource, type Events } from 'src/declarations/metadata-source'
import { ClaimId, getClaims } from 'src/lib/wikidata-claim'
import VError from 'verror'
import { log } from '@project-maps/logging'
import { nextTick } from 'src/lib/delay'

export class WikidataSource extends MetadataSource {
  constructor(private client: Wikidata) {
    super()
  }

  private processEntity(entity: SimplifiedEntity, onItem: (item: MetadataItem) => void) {
    try {
      if (!entity || entity.type !== 'item') {
        return
      }

      onItem(
        MetadataItem.fromObject({
          attribution: {
            source: AttributionSource.Wikidata,
            license: 'CC0',
            name: entity.id,
            url: `https://www.wikidata.org/wiki/${entity.id}`,
          },
          description: {
            text: entity.descriptions?.en, // TODO: i18n
          },
        })
      )

      const image = getClaims(entity, [
        ClaimId.Image,
        ClaimId.NighttimeView,
        ClaimId.PanoramicView,
        ClaimId.ImageOfInterior,
        ClaimId.PlaqueImage,
        ClaimId.WinterView,
      ])

      if (image && image.length > 0) {
        for (const imageClaim of image) {
          onItem(
            MetadataItem.fromObject({
              attribution: {
                source: AttributionSource.Wikidata,
                license: 'CC0',
                name: entity.id,
                url: `https://www.wikidata.org/wiki/${entity.id}`,
              },
              image: {
                url: {
                  canonical: this.client.getImageUrl(String(imageClaim)),
                },
              },
            })
          )
        }
      }

      const instagram = getClaims(entity, [ClaimId.InstagramUsername])

      if (instagram?.length)
        onItem(
          MetadataItem.fromObject({
            attribution: {
              source: AttributionSource.Wikidata,
              license: 'CC0',
              name: entity.id,
              url: `https://www.wikidata.org/wiki/${entity.id}`,
            },
            links: {
              list: instagram?.length
                ? instagram!
                    .map((item) => ({
                      url: `https://instagram.com/${item}`,
                    }))
                    .filter((link) => link !== null)
                : undefined,
            },
          })
        )

      const linkedin = getClaims(entity, [ClaimId.LinkedinCompanyPage])

      if (linkedin?.length)
        onItem(
          MetadataItem.fromObject({
            attribution: {
              source: AttributionSource.Wikidata,
              license: 'CC0',
              name: entity.id,
              url: `https://www.wikidata.org/wiki/${entity.id}`,
            },
            links: {
              list: linkedin?.length
                ? linkedin
                    .map((item) => ({
                      url: `https://linkedin.com/company/${item}`,
                    }))
                    .filter((link) => link !== null)
                : undefined,
            },
          })
        )

      const pinterest = getClaims(entity, [ClaimId.PinterestUsername])

      if (pinterest?.length)
        onItem(
          MetadataItem.fromObject({
            attribution: {
              source: AttributionSource.Wikidata,
              license: 'CC0',
              name: entity.id,
              url: `https://www.wikidata.org/wiki/${entity.id}`,
            },
            links: {
              list: pinterest?.length
                ? pinterest
                    .map((item) => ({
                      url: `https://pinterest.com/${item}`,
                    }))
                    .filter((link) => link !== null)
                : undefined,
            },
          })
        )

      const x = getClaims(entity, [ClaimId.XUsername])

      if (x?.length)
        onItem(
          MetadataItem.fromObject({
            attribution: {
              source: AttributionSource.Wikidata,
              license: 'CC0',
              name: entity.id,
              url: `https://www.wikidata.org/wiki/${entity.id}`,
            },
            links: {
              list: x?.length
                ? x
                    .map((item) => ({
                      url: `https://x.com/${item}`,
                    }))
                    .filter((link) => link !== null)
                : undefined,
            },
          })
        )

      const facebook = getClaims(entity, [ClaimId.FacebookUsername])

      if (facebook?.length)
        onItem(
          MetadataItem.fromObject({
            attribution: {
              source: AttributionSource.Wikidata,
              license: 'CC0',
              name: entity.id,
              url: `https://www.wikidata.org/wiki/${entity.id}`,
            },
            links: {
              list: facebook?.length
                ? facebook
                    .map((item) => ({
                      url: `https://facebook.com/${item}`,
                    }))
                    .filter((link) => link !== null)
                : undefined,
            },
          })
        )

      const bbcNewsTopicId = getClaims(entity, [ClaimId.BBCNewsTopicId])

      if (bbcNewsTopicId?.length) {
        for (const item of bbcNewsTopicId) {
          onItem(
            MetadataItem.fromObject({
              attribution: {
                source: AttributionSource.Wikidata,
                license: 'CC0',
                name: entity.id,
                url: `https://www.wikidata.org/wiki/${entity.id}`,
              },
              newsTopicReference: {
                publisher: AttributionSource.BBC,
                id: item.toString(),
              },
            })
          )
        }
      }

      const theIndependentTopicId = getClaims(entity, [ClaimId.TheIndependentTopicId])

      if (theIndependentTopicId?.length) {
        for (const item of theIndependentTopicId) {
          onItem(
            MetadataItem.fromObject({
              attribution: {
                source: AttributionSource.Wikidata,
                license: 'CC0',
                name: entity.id,
                url: `https://www.wikidata.org/wiki/${entity.id}`,
              },
              newsTopicReference: {
                publisher: AttributionSource.TheIndependent,
                id: item.toString(),
              },
            })
          )
        }
      }

      const logo = getClaims(entity, [ClaimId.LogoImage])
      const smallLogo = getClaims(entity, [ClaimId.SmallLogo])

      if (logo?.length || smallLogo?.length)
        onItem(
          MetadataItem.fromObject({
            attribution: {
              source: AttributionSource.Wikidata,
              license: 'CC0',
              name: entity.id,
              url: `https://www.wikidata.org/wiki/${entity.id}`,
            },
            logo: {
              canonical: logo ? this.client.getImageUrl(String(logo[0])) : undefined,
              small: smallLogo ? this.client.getImageUrl(String(smallLogo[0])) : undefined,
            },
          })
        )

      const links = getClaims(entity, [ClaimId.OfficialWebsite])

      // TODO: i18n
      if (entity.sitelinks?.enwiki) {
        links.push(`https://en.wikipedia.org/wiki/${entity.sitelinks.enwiki}`)
      }

      if (links?.length) {
        onItem(
          MetadataItem.fromObject({
            attribution: {
              source: AttributionSource.Wikidata,
              license: 'CC0',
              name: entity.id,
              url: `https://www.wikidata.org/wiki/${entity.id}`,
            },
            links: {
              list: links.map((link) => ({
                url: String(link),
              })),
            },
          })
        )
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new VError(error, 'WikidataSource.processEntity')
      }

      throw new Error('WikidataSource.processEntity')
    }
  }

  override listen(events: Emittery<Events>): () => void {
    const handleItem = async (data: MetadataItem) => {
      if (!data.has_wikidataId || !isEntityId(data.wikidataId)) {
        return
      }

      events.emit('start')

      try {
        const entities = await this.client.getEntities({ ids: [data.wikidataId] })

        if (!entities || Object.keys(entities).length === 0) return

        for (const entity of Object.values(entities)) {
          this.processEntity(entity, (item) => {
            events.emit('metadata', item)
          })
        }
      } catch (error) {
        if (error instanceof Error) {
          log.error(new VError(error, 'WikidataSource.listen'))
        } else {
          log.error(new Error('WikidataSource.listen'))
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
