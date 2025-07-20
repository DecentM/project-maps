import got from 'got'

import { config } from 'src/config'

// https://nominatim.org/release-docs/develop/api/Output/
export type SearchParams = {
  q: string
  'accept-language': string
  street?: string
  city?: string
  state?: string
  country?: string
  viewbox?: string
  postalcode?: string
  countrycodes?: string[]
  bounded?: 0 | 1
  polygon?: 0 | 1
  email?: string
  exclude_place_ids?: string
  limit?: number
  dedupe?: 0 | 1
}

export type SearchResult = {
  place_id: number
  osm_id: number
  osm_type: 'node' | 'way' | 'relation'
  boundingbox?: [string, string, string, string]
  lat: string
  lng: string
  display_name: string
  name: string
  class: string
  type: string
  importance: number
  licence: string
}

export class NominatimClient {
  private get = <T>(path: string, params: URLSearchParams) => {
    params.append('format', 'json') // or jsonv2

    return got
      .get(`${config.nominatim.endpoint}${path}`, {
        searchParams: params,
      })
      .json<T>()
  }

  public search = async (params: SearchParams) => {
    const urlParams = new URLSearchParams([])

    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value)) {
        urlParams.append(key, value.join(','))
      } else if (typeof value === 'number') {
        urlParams.append(key, String(value))
      } else {
        urlParams.append(key, value)
      }
    }

    return this.get<SearchResult[]>('/search', urlParams)
  }
}
