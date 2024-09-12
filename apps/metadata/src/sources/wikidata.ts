import type Emittery from 'emittery'
import { isEntityId, type EntityId, type SimplifiedEntity } from 'wikibase-sdk'

import { Metadata } from '@project-maps/proto/metadata'
import type { Geospatial } from '@project-maps/proto/lib/geospatial'
import { OverpassInterpreter } from '@project-maps/proto/overpass-interpreter'

import { WikidataClient } from 'src/clients/wikidata'
import { MetadataSource, type Events } from 'src/declarations/metadata-source'
import { overpassClient } from 'src/clients/overpass-interpreter'
import { ClaimId, getClaims } from 'src/lib/wikidata-claim'

export class WikidataSource extends MetadataSource {
  private processEntity(entity: SimplifiedEntity, onItem: (item: Metadata.MetadataItem) => void) {
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
  }

  private client = new WikidataClient()

  override handlesLocation(coordinates: Geospatial.Coordinates): boolean {
    return true // Handles all locations
  }

  public async getAreaMetadata(
    params: Metadata.GetAreaMetadataInput,
    events: Emittery<Events>
  ): Promise<void> {
    const ids = overpassClient.WikidataIdsInRange(
      OverpassInterpreter.QueryParameters.fromObject({
        range: params.radiusMeters,
        coordinates: params.coordinates,
        tags: ['wikidata', 'brand:wikidata'],
      })
    )

    const requestedIds: EntityId[] = []

    ids.on('data', async (data: OverpassInterpreter.WikidataId) => {
      if (isEntityId(data.id)) {
        requestedIds.push(data.id)
      }
    })

    ids.on('end', async () => {
      if (requestedIds.length === 0) {
        events.emit('end')
        return
      }

      const entities = await this.client.getEntities({
        ids: requestedIds,
      })

      for (const requestedId of requestedIds) {
        const entity = entities[requestedId]

        this.processEntity(entity, (item) => {
          events.emit('item', item)
        })
      }

      events.emit('end')
    })

    ids.on('error', (error: Error) => {
      console.error(error)
      events.emit('end')
    })
  }

  override async getPoiMetadata(
    request: Metadata.GetPoiMetadataInput,
    events: Emittery<Events>
  ): Promise<void> {
    const wikidataIdStream = overpassClient.PoiWikidataId(
      OverpassInterpreter.PoiMetadataParameters.fromObject({ id: request.id, tags: ['wikidata', 'brand:wikidata'] })
    )

    wikidataIdStream.on('data', async (data: OverpassInterpreter.WikidataId) => {
      if (isEntityId(data.id)) {
        const entities = await this.client.getEntities({ ids: [data.id] })

        if (!entities || Object.keys(entities).length === 0) return

        for (const entity of Object.values(entities)) {
          this.processEntity(entity, (item) => {
            events.emit('item', item)
          })
        }
      }
    })

    wikidataIdStream.on('end', () => {
      events.emit('end')
    })
  }
}
