import got from 'got'

import * as Query from '../queries'
import type { OverpassInterpreter } from '@project-maps/proto/overpass-interpreter'

export type InterpreterResponse = {
  version: number
  generator: string
  osm3s?: {
    timestamp_osm_base?: string,
    copyright?: string
  },
  elements: Array<{
    type: string
    id: number
    lat?: number
    lon?: number
    tags?: Record<string, string>
    nodes?: Array<number>
  }>
}

const isInterpreterResponse = (response: unknown): response is InterpreterResponse => {
  return typeof response === 'object'
    && response !== null
    && 'version' in response
    && 'generator' in response
    && 'elements' in response
    && Array.isArray(response.elements)
    && response.elements.every((element: unknown) => {
      return typeof element === 'object'
        && element !== null
        && 'type' in element
        && 'id' in element
        && 'tags' in element
        && typeof element.tags === 'object'
    })
}

export class OverpassClient {
  public constructor(
    private baseUrl: string
  ) { }

  private fetch = (path: string, formData: Record<string, string | number>) => {
    return got.get(`${this.baseUrl}${path}`, {
      form: formData,
    }).json()
  }

  public async shortRangeNamed (params: ReturnType<typeof OverpassInterpreter.QueryInput['toObject']>): Promise<InterpreterResponse> {
    const result = await this.fetch('/api/interpreter', {data: await Query.ShortRangeNamed.create(params)})

    if (!isInterpreterResponse(result)) {
      throw new Error('Invalid response from interpreter')
    }

    return result
  }
}
