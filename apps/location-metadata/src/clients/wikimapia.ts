import got, { type Method } from 'got'
import type { StringArrayCombinations } from 'src/declarations/tuple-union'

type Pagination = {
  page: number
  count: number
}

type CatgegoryFilter = {
  /**
   * http://wikimapia.org/api#categorygetall
   */
  category: number
  categories_or?: undefined
  categories_and?: undefined
} | {
  category?: undefined
  /**
   * Comma separated numbers
   *
   * @link http://wikimapia.org/api#categorygetall
   */
  categories_or: string
  categories_and?: undefined
} | {
  category?: undefined
  categories_or?: undefined
  /**
   * Comma separated numbers
   *
   * @link http://wikimapia.org/api#categorygetall
   */
  categories_and: string
}

type Place_GetnearestParams = Partial<Pagination> & Partial<CatgegoryFilter> & {
  lat: number
  lon: number
  data_blocks?: StringArrayCombinations<['location', 'geometry']>
}

type Place_GetnearestResponse = {
  language: string
  found: number
  count: number
  places: Array<{
    id: number
    title: string
    urlhtml: string
    urlkml: string
    distance: number
    location: unknown
    polygon: unknown
  }>
}

type Place_GetbyidParams = {
  id: number
  data_blocks?: StringArrayCombinations<['main', 'geometry', 'edit', 'location', 'attached', 'photos', 'comments', 'translate', 'similar_places', 'nearest_places', 'nearest_comments', 'nearest_streets', 'nearest_hotels']>
}

export class WikimapiaClient {
  public constructor(
    private baseUrl: string,
    private apiKey: string
  ) { }

  private fetch (method: Method, path: string, query: Record<string, string | number | undefined>) {
    return got(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
      },
      searchParams: {
        ...query,
        key: this.apiKey,
        format: 'json',
        pack: 'gzip',
      },

    }).json()
  }

  private async runFunction <T>(name: string, query: Record<string, string | number | undefined>) {
    return await this.fetch('GET', '/', {...query, function: name}) as T
  }

  /**
   * @deprecated This endpoint is broken. See http://wikimapia.org/forum/viewtopic.php?f=12&t=15031
   */
  public async Place_GetByArea(params: never): Promise<never> {
    return undefined as never
  }

  public async Place_Getnearest (params: Place_GetnearestParams) {
    return this.runFunction<Place_GetnearestResponse>('place.getnearest', params)
  }

  public async Place_Getbyid (params: Place_GetbyidParams) {
    return this.runFunction('place.getbyid', params)
  }
}
