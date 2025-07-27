import { log } from '@project-maps/logging'
import { got } from 'got'
import VError from 'verror'
import { WBK, type Entities, type EntityId, type SimplifiedEntity } from 'wikibase-sdk'

type GetEntitiesParams = {
  ids: EntityId[]
}

type GetEntitiesResponse = Record<string, SimplifiedEntity>

export class WikidataClient {
  private readonly wbk = WBK({
    instance: 'https://www.wikidata.org',
    sparqlEndpoint: 'https://query.wikidata.org/sparql',
  })

  private fetch<T>(url: string) {
    log.trace({ url }, 'WikidataClient.fetch')

    return got(url, {
      retry: {
        limit: 3,
        statusCodes: [408, 429, 500, 502, 503, 504],
        calculateDelay({ attemptCount }) {
          return Math.min(attemptCount * 250, 2500)
        },
      },
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
