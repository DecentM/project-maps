import VError from 'verror'
import got, { type Method } from 'got'

import type { StringArrayCombinations } from 'src/declarations/tuple-union'
import { log } from '@project-maps/logging'

type Pagination = {
  page: number
  count: number
}

type CatgegoryFilter =
  | {
      /**
       * http://wikimapia.org/api#categorygetall
       */
      category: number
      categories_or?: undefined
      categories_and?: undefined
    }
  | {
      category?: undefined
      /**
       * Comma separated numbers
       *
       * @link http://wikimapia.org/api#categorygetall
       */
      categories_or: string
      categories_and?: undefined
    }
  | {
      category?: undefined
      categories_or?: undefined
      /**
       * Comma separated numbers
       *
       * @link http://wikimapia.org/api#categorygetall
       */
      categories_and: string
    }

type Place_GetnearestParams = Partial<Pagination> &
  Partial<CatgegoryFilter> & {
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
  data_blocks?: StringArrayCombinations<
    [
      'main',
      'geometry',
      'edit',
      'location',
      'attached',
      'photos',
      'comments',
      'translate',
      'similar_places',
      'nearest_places',
      'nearest_comments',
      'nearest_streets',
      'nearest_hotels',
    ]
  >
}

type Place_GetbyidResponse = {
  id: number
  object_type: number
  language_id: number
  language_iso: string
  language_name: string
  urlhtml: string
  title: string
  description: string
  wikipedia: string
  is_building: boolean
  is_region: boolean
  is_deleted: boolean
  tags: Array<{
    id: number
    title: string
  }>
  parent_id: string
  x: string
  y: string
  pl: number
  polygon: Array<{
    x: number
    y: number
  }>
  edit_info: {
    user_id: number
    user_name: string
    date: number
    is_unbindable: null
    deletion_state: boolean
    is_in_deletion_queue: boolean
    is_in_undeletion_queue: boolean
  }
  is_protected: boolean
  photos: Array<{
    id: number
    size: number
    status: number
    object_id: number
    user_id: number
    user_name: string
    time: number
    time_str: string
    last_user_id: number
    last_user_name: string
    '960_url': string
    '1280_url': string
    big_url: string
    thumbnail_url: string
    thumbnailRetina_url: string
  }>
  deleted_photos: Array<never>
  comments: Array<{
    place_id: number
    num: number
    lang_id: number
    user_id: number
    user_ip: number
    user_photo: string
    name: string
    message: string
    good: number
    bad: number
    block: boolean
    date: number
    moder_uid: number
    moder_name: null
    is_deleted: boolean
    replies: Array<never>
  }>
  location: {
    lon: number
    lat: number
    north: number
    south: number
    east: number
    west: number
    country: string
    state: string
    place: string
    country_adm_id: number
    gadm: Array<{
      id: string
      country: string
      level: string
      is_last_level: string
      name: string
      iso: null
      type: null
      translation: string
    }>
    city_id: string
    city: string
    cityguideDomain: string
    zoom: number
  }
  availableLanguages: Record<
    string,
    {
      lang_id: number
      lang_name: string
      object_local_slug: string
      native_name: string
      object_url: string
    }
  >
  similarPlaces: Record<
    string,
    {
      id: string
      language_id: number
      language_iso: string
      language_name: string
      title: string
      url: string
      lon: number
      lat: number
      distance: number
    }
  >
  nearestHotels: Array<unknown>
  children: Record<
    string,
    {
      id: number
      language_id: number
      language_iso: string
      language_name: string
      title: string
      url: string
      tags: Array<{
        id: number
        title: string
      }>
      is_deleted: boolean
    }
  >
}

export class WikimapiaClient {
  public constructor(
    private baseUrl: string,
    private apiKey: string
  ) {}

  private fetch(method: Method, path: string, query: Record<string, string | number | undefined>) {
    log.trace({ base: this.baseUrl, method, path, query }, 'WikimapiaClient.fetch')

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

  private async runFunction<T>(name: string, query: Record<string, string | number | undefined>) {
    return (await this.fetch('GET', '/', { ...query, function: name })) as T
  }

  /**
   * @deprecated This endpoint is broken. See http://wikimapia.org/forum/viewtopic.php?f=12&t=15031
   */
  public async Place_GetByArea(params: never): Promise<never> {
    return undefined as never
  }

  public async Place_Getnearest(params: Place_GetnearestParams) {
    try {
      return this.runFunction<Place_GetnearestResponse>('place.getnearest', params)
    } catch (error) {
      if (error instanceof Error) {
        throw new VError(error, 'WikimapiaClient.Place_Getnearest')
      }

      throw new Error('WikimapiaClient.Place_Getnearest')
    }
  }

  public async Place_Getbyid(params: Place_GetbyidParams) {
    try {
      return this.runFunction<Place_GetbyidResponse>('place.getbyid', params)
    } catch (error) {
      if (error instanceof Error) {
        throw new VError(error, 'WikimapiaClient.Place_Getbyid')
      }

      throw new Error('WikimapiaClient.Place_Getbyid')
    }
  }
}
