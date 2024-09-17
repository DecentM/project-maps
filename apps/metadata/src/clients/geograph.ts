import got from 'got'
import { XMLParser } from 'fast-xml-parser'
import VError from 'verror'
import { log } from '@project-maps/logging'

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
  generator: 'FeedCreator 1.7.12(BH)'
  title: string
  description: string
  link: string
  syndicationURL: string
  nextURL?: string
  icon: string
  date: string
  items: Array<{
    title: string
    link: string // URL
    author: string
    category?: string
    guid: string
    source: string
    date: number
    imageTaken?: string // YYYY-MM-DD
    dateUpdated: number
    lat: string
    long: string
    thumb: string // URL
    thumbTag: string // HTML
    licence: string // URL
  }>
}

const isSyndicationResponse = (response: unknown): response is SyndicatorResponse => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'generator' in response &&
    typeof response.generator === 'string' &&
    response.generator.startsWith('FeedCreator') &&
    'title' in response &&
    'description' in response &&
    'link' in response &&
    'syndicationURL' in response &&
    'icon' in response &&
    'date' in response &&
    'items' in response &&
    Array.isArray(response.items) &&
    response.items.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'title' in item &&
        'link' in item &&
        'author' in item &&
        'guid' in item &&
        'source' in item &&
        'date' in item &&
        'dateUpdated' in item &&
        'lat' in item &&
        'long' in item &&
        'thumb' in item &&
        'thumbTag' in item &&
        'licence' in item
    )
  )
}

export type PhotoResponse = {
  '?xml': { version: '1.0'; encoding: 'UTF-8' }
  geograph: {
    status: { state: string }
    title: string
    gridref: string
    user: {
      '#text': string
      profile: string // URL
    }
    img: {
      src: string // URL
      crossorigin: string
      width: string // int
      height: string // int
      style: string // css
    }
    thumbnail: string // URL
    taken: string // YYYY-MM-DD
    submitted: string // YYYY-MM-DD HH:MM:SS
    category?: string
    comment?: string
  }
}

const isPhotoResponse = (response: unknown): response is PhotoResponse => {
  return (
    typeof response === 'object' &&
    response !== null &&
    '?xml' in response &&
    typeof response['?xml'] === 'object' &&
    response['?xml'] !== null &&
    'version' in response['?xml'] &&
    'encoding' in response['?xml'] &&
    response['?xml'].version === '1.0' &&
    response['?xml'].encoding === 'UTF-8' &&
    'geograph' in response &&
    typeof response.geograph === 'object' &&
    response.geograph !== null &&
    'status' in response.geograph &&
    'title' in response.geograph &&
    'gridref' in response.geograph &&
    'user' in response.geograph &&
    'img' in response.geograph &&
    'thumbnail' in response.geograph &&
    'taken' in response.geograph &&
    'submitted' in response.geograph
  )
}

export class GeographClient {
  private xmlParser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  })

  public constructor(
    private baseUrl: string,
    private apiKey: string
  ) { }

  private fetch = (path: string, query: Record<string, string | number>) => {
    log.trace({ path, query }, 'GeographClient.fetch')

    return got.get(`${this.baseUrl}${path}`, {
      headers: {
        Accept: 'application/json',
      },
      searchParams: query,
    })
  }

  private get = (path: string, query: Record<string, string | number> = {}) => {
    return this.fetch(path, query)
  }

  public syndicator = async (request: SyndicatorRequest): Promise<SyndicatorResponse> => {
    try {
      const result = this.get('/syndicator.php', {
        ...request,
        key: this.apiKey,
        format: 'JSON',
      })

      const json = await result.json()

      if (!isSyndicationResponse(json)) {
        throw new Error('Invalid response from Geograph API: /syndicator.php')
      }

      return json
    } catch (error) {
      if (error instanceof Error) {
        throw new VError(error, 'GeographClient.syndicator')
      }

      throw new Error('GeographClient.syndicator')
    }
  }

  public photo = async (guid: string): Promise<PhotoResponse> => {
    try {
      const result = await this.get(`/api/photo/${guid}/${this.apiKey}`)

      const json = this.xmlParser.parse(result.body)

      if (!isPhotoResponse(json)) {
        throw new Error(`Invalid response from Geograph API: /api/photo/${guid}`)
      }

      return json
    } catch (error) {
      if (error instanceof Error) {
        throw new VError(error, 'GeographClient.photo')
      }

      throw new Error('GeographClient.photo')
    }
  }
}
