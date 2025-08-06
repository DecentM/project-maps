import { log } from '@project-maps/logging'
import VError from 'verror'
import { WBK, type Entities, type EntityId, type SimplifiedEntity } from 'wikibase-sdk'

import { http } from 'src/lib/http'

type GetEntitiesParams = {
  ids: EntityId[]
}

type GetEntitiesResponse = Record<string, SimplifiedEntity>

export type Wikidata = {
  getEntities: (params: GetEntitiesParams) => Promise<GetEntitiesResponse>
  getImageUrl: (filename: string) => string | undefined
}

export class WikidataClient implements Wikidata {
  private readonly wbk = WBK({
    instance: 'https://www.wikidata.org',
    sparqlEndpoint: 'https://query.wikidata.org/sparql',
  })

  private got = http()

  private fetch<T>(url: string) {
    log.trace({ url }, 'WikidataClient.fetch')

    return this.got(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }).json<T>()
  }

  public async getEntities(params: GetEntitiesParams): Promise<GetEntitiesResponse> {
    try {
      const { entities, success } = await this.fetch<{ entities: Entities; success: number }>(
        this.wbk.getEntities(params)
      )

      if (success !== 1) {
        throw new Error(`success: ${success}`)
      }

      return this.wbk.simplify.entities(entities)
    } catch (error) {
      if (error instanceof Error) {
        throw new VError(error, 'WikidataClient.getEntities')
      }

      throw new Error('WikidataClient.getEntities')
    }
  }

  public getImageUrl(filename: string): string | undefined {
    try {
      return this.wbk.getImageUrl(filename)
    } catch (error) {
      if (error instanceof Error) {
        throw new VError(error, 'WikidataClient.getImageUrl')
      }

      throw new Error('WikidataClient.getImageUrl')
    }
  }
}
