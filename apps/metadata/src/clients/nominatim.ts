import { config } from 'src/config'
import { http } from 'src/lib/http'

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
  addressdetails?: 0 | 1
  extratags?: 0 | 1
  namedetails?: 0 | 1
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
  address?: {
    road?: string
    city?: string
    town?: string
    county?: string
    state?: string
    postcode?: string
    country?: string
    hamlet?: string
    state_district?: string
    village?: string
    municipality?: string
    district?: string
  }
}

// https://nominatim.org/release-docs/develop/api/Reverse/
export type ReverseParams = {
  lat: string
  lon: string
  addressdetails?: 0 | 1
  extratags?: 0 | 1
  namedetails?: 0 | 1
  zoom?: number
  layer?: string
}

export type ReverseResult = {
  place_id: number
  licence: string
  osm_type: 'node' | 'way' | 'relation'
  osm_id: number
  lat: string
  lon: string
  class: string
  type: string
  place_rank: number
  importance: number
  addresstype: string
  name: string
  display_name: string
  address?: {
    shop: string
    house_number: string
    road: string
    city_district: string
    'ISO3166-2-lvl8': string
    city: string
    state_district: string
    state: string
    'ISO3166-2-lvl4': string
    postcode: string
    country: string
    country_code: string
  }
  extratags?: Record<string, string>
  boundingbox: [string, string, string, string]
}

export type OsmId = `N${string}` | `W${string}` | `R${string}`

export type LookupParams = {
  osm_ids: OsmId[]
  addressdetails?: 0 | 1
  extratags?: 0 | 1
  namedetails?: 0 | 1
  'accept-language'?: string
}

export type LookupResult = Array<ReverseResult>

export type Nominatim = {
  search: (params: SearchParams) => Promise<SearchResult[]>
  reverse: (params: ReverseParams) => Promise<ReverseResult>
  lookup: (params: LookupParams) => Promise<LookupResult>
}

export class NominatimClient implements Nominatim {
  private static objectToParams(obj: Record<string, unknown>): URLSearchParams {
    const params = new URLSearchParams()

    for (const [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        params.append(key, value.join(','))
      } else if (typeof value === 'number') {
        params.append(key, String(value))
      } else if (value !== undefined && value !== null) {
        params.append(key, String(value))
      }
    }

    return params
  }

  private got = http()

  private get = <T>(path: string, params: URLSearchParams) => {
    params.append('format', 'json') // or jsonv2

    return this.got
      .get(`${config.clients.nominatim.endpoint}${path}`, {
        searchParams: params,
      })
      .json<T>()
  }

  public search = async (params: SearchParams) => {
    return this.get<SearchResult[]>('/search', NominatimClient.objectToParams(params))
  }

  public reverse = async (params: ReverseParams) => {
    return this.get<ReverseResult>('/reverse', NominatimClient.objectToParams(params))
  }

  public lookup = async (params: LookupParams) => {
    return this.get<LookupResult>('/lookup', NominatimClient.objectToParams(params))
  }
}
