import got, { type Method } from 'got'
import type { StringArrayCombinations } from 'src/declarations/tuple-union'

type ImagesFilter = {
  bbox?: string
  creator_username?: string
  is_pano?: boolean
  limit?: number
  make?: string
  model?: string
  organization_id?: string
  /**
   * Commas separated numbers.
   * @link https://www.mapillary.com/developer/api-documentation#image
   */
  sequence_ids?: string
  /**
   * ISO 8601 date.
   * @link https://en.wikipedia.org/wiki/ISO_8601
   */
  start_captured_at?: number
  /**
   * ISO 8601 date.
   * @link https://en.wikipedia.org/wiki/ISO_8601
   */
  end_captured_at?: number
}

type ImageFields = StringArrayCombinations<
    [
      'captured_at',
      'creator',
      'thumb_256_url',
      'thumb_1024_url',
      'thumb_2048_url',
      'thumb_original_url',
    ]
  >

type ImagesParams = ImagesFilter & {
  /**
   * There's more of these, but including all will exceed the TS stack limit
   * due to recursion.
   * @link https://www.mapillary.com/developer/api-documentation#image
   */
  fields?: ImageFields
}

type ImageParams = ImagesFilter & {
  id: string
  fields?: ImageFields
}

type ImageResponse = {
  id: string
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
  creator?: {
    id: string
    username: string
  }
  captured_at?: number
  thumb_256_url?: string
  thumb_1024_url?: string
  thumb_2048_url?: string
  thumb_original_url?: string
}

type ImagesResponse = {
  data: Array<ImageResponse>
}

export class MapillaryClient {
  public constructor(
    private baseUrl: string,
    private apiKey: string
  ) {}

  private fetch<T>(
    method: Method,
    path: string,
    query: Record<string, string | number | boolean | undefined>
  ) {
    return got(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
      },
      searchParams: {
        ...query,
        access_token: this.apiKey,
      },
    }).json() as T
  }

  public async images(params: ImagesParams) {
    return this.fetch<ImagesResponse>('GET', '/images', params)
  }

  public async image({ id, ...params }: ImageParams) {
    return this.fetch<ImageResponse>('GET', `/${id}`, params)
  }
}
