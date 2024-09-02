import got from 'got'

/**
 * Geograph API client
 * @see https://www.geograph.org.uk/help/api
 */
export type SyndicatorRequest = {
  i?: number
  u?: number
  q?: string
  distance?: number
  perpage?: number
  location?: string
  text?: string
}

export type SyndicatorResponse = {
  "generator": "FeedCreator 1.7.12(BH)",
  "title": string,
  "description": string,
  "link": string,
  "syndicationURL": string,
  "nextURL": string,
  "icon": string,
  "date": string,
  "items": Array<
    {
      "title": string,
      "link": string, // URL
      "author": string,
      "category": string,
      "guid": string,
      "source": string,
      "date": number,
      "imageTaken": string, // YYYY-MM-DD
      "dateUpdated": number,
      "lat": string,
      "long": string,
      "thumb": string, // URL
      "thumbTag": string, // HTML
      "licence": string, // URL
    }
  >
}

const isSyndicationResponse = (response: unknown): response is SyndicatorResponse => {
  return typeof response === 'object' &&
    response !== null &&
    'generator' in response &&
    'title' in response &&
    'description' in response &&
    'link' in response &&
    'syndicationURL' in response &&
    'nextURL' in response &&
    'icon' in response &&
    'date' in response &&
    'items' in response &&
    Array.isArray(response.items) &&
    response.items.every(item =>
      typeof item === 'object' &&
      item !== null &&
      'title' in item &&
      'link' in item &&
      'author' in item &&
      'guid' in item &&
      'source' in item &&
      'date' in item &&
      'imageTaken' in item &&
      'dateUpdated' in item &&
      'lat' in item &&
      'long' in item &&
      'thumb' in item &&
      'thumbTag' in item &&
      'licence' in item
    )
}

export class GeographClient {
  public constructor(
    private baseUrl: string,
    private apiKey: string
  ) { }

  private fetch = async (
    path: string,
    query: Record<string, string | number>
  ): Promise<unknown> => {
    const response = got.get(`${this.baseUrl}${path}`, {
      headers: {
        Accept: 'application/json',
      },
      searchParams: {
        ...query,
        key: this.apiKey,
        format: 'JSON',
      }
    })

    return await response.json()
  }

  private get = async (
    path: string,
    query: Record<string, string | number> = {}
  ): Promise<unknown> => {
    return this.fetch(path, query)
  }

  public syndicator = async (request: SyndicatorRequest): Promise<SyndicatorResponse> => {
    const result = await this.get('/syndicator.php', request)

    if (!isSyndicationResponse(result)) {
      throw new Error('Invalid response from Geograph API')
    }

    return result
  }
}
