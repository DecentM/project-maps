import { got } from 'got'
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
    return got(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }).json<T>()
  }

  public async getEntities(params: GetEntitiesParams): Promise<GetEntitiesResponse> {
    const entities = await this.fetch<Entities>(this.wbk.getEntities(params))
    return this.wbk.simplify.entities(entities)
  }

  public getImageUrl(filename: string): string | undefined {
    return this.wbk.getImageUrl(filename)
  }
}
