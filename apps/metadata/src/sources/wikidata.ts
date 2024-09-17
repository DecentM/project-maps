import type Emittery from 'emittery'
import { isEntityId, type EntityId, type SimplifiedEntity } from 'wikibase-sdk'

import { Metadata } from '@project-maps/proto/metadata'
import type { Geospatial } from '@project-maps/proto/lib/geospatial'
import { Overpass } from '@project-maps/proto/overpass'

import { WikidataClient } from 'src/clients/wikidata'
import { MetadataSource, type Events } from 'src/declarations/metadata-source'
import { OverpassClient } from 'src/clients/overpass'
import { ClaimId, getClaims } from 'src/lib/wikidata-claim'
import VError from 'verror'
import { log } from '@project-maps/logging'

export class WikidataSource extends MetadataSource {
  private overpassClient = new OverpassClient()

  private processEntity(entity: SimplifiedEntity, onItem: (item: Metadata.MetadataItem) => void) {
    try {
      if (!entity || entity.type !== 'item') {
        return
      }

      onItem(
        Metadata.MetadataItem.fromObject({
          attribution: {
            source: Metadata.Attribution.Source.Wikidata,
            license: 'CC0',
            name: entity.id,
            url: `https://www.wikidata.org/wiki/${entity.id}`,
          },
          description: {
            text: entity.descriptions?.en, // TODO: i18n
          },
        })
      )

      const image = getClaims(entity, [ClaimId.Image])

      if (image) {
        onItem(
          Metadata.MetadataItem.fromObject({
            attribution: {
              source: Metadata.Attribution.Source.Wikidata,
              license: 'CC0',
              name: entity.id,
              url: `https://www.wikidata.org/wiki/${entity.id}`,
            },
            image: {
              url: {
                canonical: this.client.getImageUrl(String(image[0])),
              },
            },
          })
        )
      }

      const instagram = getClaims(entity, [ClaimId.InstagramUsername])

      if (instagram?.length)
        onItem(
          Metadata.MetadataItem.fromObject({
            attribution: {
              source: Metadata.Attribution.Source.Wikidata,
              license: 'CC0',
              name: entity.id,
              url: `https://www.wikidata.org/wiki/${entity.id}`,
            },
            links: {
              list: instagram?.length
                ? instagram!
                    .map((item) => ({
                      type: Metadata.Link.Type.Instagram,
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
          Metadata.MetadataItem.fromObject({
            attribution: {
              source: Metadata.Attribution.Source.Wikidata,
              license: 'CC0',
              name: entity.id,
              url: `https://www.wikidata.org/wiki/${entity.id}`,
            },
            links: {
              list: linkedin?.length
                ? linkedin
                    .map((item) => ({
                      type: Metadata.Link.Type.LinkedIn,
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
          Metadata.MetadataItem.fromObject({
            attribution: {
              source: Metadata.Attribution.Source.Wikidata,
              license: 'CC0',
              name: entity.id,
              url: `https://www.wikidata.org/wiki/${entity.id}`,
            },
            links: {
              list: pinterest?.length
                ? pinterest
                    .map((item) => ({
                      type: Metadata.Link.Type.Pinterest,
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
          Metadata.MetadataItem.fromObject({
            attribution: {
              source: Metadata.Attribution.Source.Wikidata,
              license: 'CC0',
              name: entity.id,
              url: `https://www.wikidata.org/wiki/${entity.id}`,
            },
            links: {
              list: x?.length
                ? x
                    .map((item) => ({
                      type: Metadata.Link.Type.X,
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
          Metadata.MetadataItem.fromObject({
            attribution: {
              source: Metadata.Attribution.Source.Wikidata,
              license: 'CC0',
              name: entity.id,
              url: `https://www.wikidata.org/wiki/${entity.id}`,
            },
            links: {
              list: facebook?.length
                ? facebook
                    .map((item) => ({
                      type: Metadata.Link.Type.Facebook,
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
          Metadata.MetadataItem.fromObject({
            attribution: {
              source: Metadata.Attribution.Source.Wikidata,
              license: 'CC0',
              name: entity.id,
              url: `https://www.wikidata.org/wiki/${entity.id}`,
            },
            links: {
              list: bbcNewsTopicId?.length
                ? bbcNewsTopicId
                    .map((item) => ({
                      type: Metadata.Link.Type.BBCNewsTopic,
                      url: `https://www.bbc.co.uk/news/topics/${item}`,
                    }))
                    .filter((link) => link !== null)
                : undefined,
            },
          })
        )

      const logo = getClaims(entity, [ClaimId.Logo])
      const smallLogo = getClaims(entity, [ClaimId.SmallLogo])

      if (logo?.length || smallLogo?.length)
        onItem(
          Metadata.MetadataItem.fromObject({
            attribution: {
              source: Metadata.Attribution.Source.Wikidata,
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

      const website = getClaims(entity, [ClaimId.OfficialWebsite])

      if (website?.length)
        onItem(
          Metadata.MetadataItem.fromObject({
            attribution: {
              source: Metadata.Attribution.Source.Wikidata,
              license: 'CC0',
              name: entity.id,
              url: `https://www.wikidata.org/wiki/${entity.id}`,
            },
            website: {
              url: String(website[0]),
            },
          })
        )
    } catch (error) {
      if (error instanceof Error) {
        throw new VError(error, 'WikidataSource.processEntity')
      }

      throw new Error('WikidataSource.processEntity')
    }
  }

  private client = new WikidataClient()

  override handlesLocation(coordinates: Geospatial.Coordinates): boolean {
    return true // Handles all locations
  }

  public getAreaMetadata(
    params: Metadata.GetAreaMetadataInput,
    events: Emittery<Events>
  ): void {
    const ids = this.overpassClient.WikidataIdsInRange(
      Overpass.QueryParameters.fromObject({
        range: params.radiusMeters,
        coordinates: params.coordinates,
        tags: ['wikidata', 'brand:wikidata'],
      })
    )

    const requestedIds: EntityId[] = []

    ids.on('data', (data: Overpass.WikidataId) => {
      if (isEntityId(data.id)) {
        requestedIds.push(data.id)
      }
    })

    ids.on('end', async () => {
      if (requestedIds.length === 0) {
        events.emit('end')
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

      events.emit('end')
    })

    ids.on('error', (error: Error) => {
      log.error(new VError(error, 'WikidataSource.getAreaMetadata'))
      events.emit('end')
    })
  }

  override async getPoiMetadata(
    request: Metadata.GetPoiMetadataInput,
    events: Emittery<Events>
  ): Promise<void> {
    const wikidataIdStream = this.overpassClient.PoiWikidataId(
      Overpass.PoiMetadataParameters.fromObject({ id: request.id, tags: ['wikidata', 'brand:wikidata'] })
    )

    wikidataIdStream.on('data', async (data: Overpass.WikidataId) => {
      try {
        if (!isEntityId(data.id)) return

        const entities = await this.client.getEntities({ ids: [data.id] })

        if (!entities || Object.keys(entities).length === 0) return

        for (const entity of Object.values(entities)) {
          this.processEntity(entity, (item) => {
            events.emit('item', item)
          })
        }
      } catch (error) {
        if (error instanceof Error) {
          log.error(new VError(error, 'WikidataSource.getPoiMetadata'))
        }

        log.error(error, 'WikidataSource.getPoiMetadata')
      }
    })

    wikidataIdStream.on('end', () => {
      events.emit('end')
    })

    wikidataIdStream.on('error', (error: Error) => {
      log.error(new VError(error, 'WikidataSource.getPoiMetadata'))
      events.emit('end')
    })
  }
}
