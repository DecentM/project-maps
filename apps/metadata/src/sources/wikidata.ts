import type Emittery from 'emittery'
import { isEntityId, type EntityId, type SimplifiedEntity } from 'wikibase-sdk'

import {
  MetadataItem,
  AttributionSource,
  type GetAreaMetadataInput,
  type GetPoiMetadataInput,
} from '@project-maps/proto/metadata/node'
import type { Coordinates } from '@project-maps/proto/lib/geospatial/node'
import { QueryParameters, type WikidataId } from '@project-maps/proto/overpass/node'

import { WikidataClient } from 'src/clients/wikidata'
import { MetadataSource, type Events } from 'src/declarations/metadata-source'
import { OverpassClient } from 'src/clients/overpass'
import { ClaimId, getClaims } from 'src/lib/wikidata-claim'
import VError from 'verror'
import { log } from '@project-maps/logging'

export class WikidataSource extends MetadataSource {
  private overpassClient = new OverpassClient()

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
      ])

      if (image && image.length !== 0) {
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

      if (bbcNewsTopicId?.length)
        onItem(
          MetadataItem.fromObject({
            attribution: {
              source: AttributionSource.Wikidata,
              license: 'CC0',
              name: entity.id,
              url: `https://www.wikidata.org/wiki/${entity.id}`,
            },
            links: {
              list: bbcNewsTopicId?.length
                ? bbcNewsTopicId
                    .map((item) => ({
                      url: `https://www.bbc.co.uk/news/topics/${item}`,
                    }))
                    .filter((link) => link !== null)
                : undefined,
            },
          })
        )

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

  private client = new WikidataClient()

  override handlesLocation(coordinates: Coordinates): boolean {
    return true // Handles all locations
  }

  public async getAreaMetadata(
    params: GetAreaMetadataInput,
    events: Emittery<Events>
  ): Promise<void> {
    const ids = this.overpassClient.WikidataIdsInRange(
      QueryParameters.fromObject({
        range: params.radiusMeters,
        coordinates: params.coordinates,
        tags: ['wikidata', 'brand:wikidata'],
      })
    )

    const requestedIds: EntityId[] = []

    ids.on('data', (data: WikidataId) => {
      if (isEntityId(data.id)) {
        requestedIds.push(data.id)
      }
    })

    ids.on('end', async () => {
      if (requestedIds.length === 0) {
        return
      }

      try {
        const entities = await this.client.getEntities({
          ids: requestedIds,
        })

        for (const requestedId of requestedIds) {
          const entity = entities[requestedId]

          this.processEntity(entity, (item) => {
            events.emit('item', item)
          })
        }
      } catch (error) {
        if (error instanceof Error) {
          log.error(new VError(error, 'WikidataSource.getAreaMetadata'))
        }

        log.error(error, 'WikidataSource.getAreaMetadata')
      }
    })

    ids.on('error', (error: Error) => {
      log.error(new VError(error, 'WikidataSource.getAreaMetadata'))
    })
  }

  override getPoiMetadata(request: GetPoiMetadataInput, events: Emittery<Events>): Promise<void> {
    let foundWikidataId = false

    return new Promise((resolve, reject) => {
      events.once('overpass-end').then(() => {
        if (!foundWikidataId) resolve()
      })

      const handleItem = async (item: MetadataItem) => {
        if (!item.wikidataId || !isEntityId(item.wikidataId)) {
          return
        }

        foundWikidataId = true
        events.off('item', handleItem)

        try {
          const entities = await this.client.getEntities({ ids: [item.wikidataId] })

          if (!entities || Object.keys(entities).length === 0) return

          for (const entity of Object.values(entities)) {
            this.processEntity(entity, (item) => {
              events.emit('item', item)
            })
          }

          resolve()
        } catch (error) {
          if (error instanceof Error) {
            log.error(new VError(error, 'WikidataSource.getPoiMetadata'))
            reject(new VError(error, 'WikidataSource.getPoiMetadata'))
          }

          log.error(error, 'WikidataSource.getPoiMetadata')
          reject(new Error('WikidataSource.getPoiMetadata'))
        }

        resolve()
      }

      events.on('item', handleItem)
    })
  }
}
