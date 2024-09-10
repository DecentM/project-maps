import got from 'got'

import * as Query from '../queries'

type Element<T extends string> = {
  type: T
  id: number
}

export type Node = Element<'node'> & {
  lat: number
  lon: number
  tags: Record<string, string>
}

export type Way = Element<'way'> & {
  nodes: Array<number>
  tags: Record<string, string>
}

export type Relation = Element<'relation'> & {
  members: Array<{
    type: string
    ref: number
    role: string
  }>
  tags: Record<string, string>
}

export type InterpreterResponse = {
  version: number
  generator: string
  osm3s?: {
    timestamp_osm_base?: string
    copyright?: string
  }
  elements: Array<Node | Way | Relation>
}

export class OverpassClient {
  public constructor(private baseUrl: string) {}

  private post = (path: string, formData: Record<string, string | number>) => {
    return got.stream.post(`${this.baseUrl}${path}`, {
      form: formData,
    })
  }

  public shortRangeNamedStreaming(params: Query.ShortRangeNamed.Params): NodeJS.ReadableStream {
    return this.post('/interpreter', {
      data: Query.ShortRangeNamed.create(params),
    })
  }

  public wikidataIdsInRangeStreaming(
    params: Query.WikidataIdsInRange.Params
  ): NodeJS.ReadableStream {
    return this.post('/interpreter', {
      data: Query.WikidataIdsInRange.create(params),
    })
  }

  public poiMetadataStreaming(params: Query.PoiMetadata.Params): NodeJS.ReadableStream {
    return this.post('/interpreter', {
      data: Query.PoiMetadata.create(params),
    })
  }

  public poiWikidataIdStreaming(params: Query.PoiWikidataId.Params): NodeJS.ReadableStream {
    return this.post('/interpreter', {
      data: Query.PoiWikidataId.create(params),
    })
  }
}
