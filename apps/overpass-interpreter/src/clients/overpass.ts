import got from 'got'

import * as Query from '../queries'
import type { OverpassInterpreter } from '@project-maps/proto/overpass-interpreter'

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
    timestamp_osm_base?: string,
    copyright?: string
  },
  elements: Array<Node | Way | Relation>
}

const isInterpreterResponse = (response: unknown): response is InterpreterResponse => {
  return typeof response === 'object'
    && response !== null
    && 'version' in response
    && 'generator' in response
    && 'elements' in response
    && Array.isArray(response.elements)
    && response.elements.every((element: unknown) => {
      const isElement = typeof element === 'object'
        && element !== null
        && 'type' in element
        && typeof element.type === 'string'

      if (!isElement) return false

      switch (element.type) {
        case 'node':
          return 'id' in element
            && typeof element.id === 'number'
            && ('lat' in element ? typeof element.lat === 'number' : true)
            && ('lon' in element ? typeof element.lon === 'number' : true)
            && ('tags' in element ? typeof element.tags === 'object' : true)
        case 'way':
          return 'id' in element
            && typeof element.id === 'number'
            && 'nodes' in element
            && Array.isArray(element.nodes)
            && ('tags' in element ? typeof element.tags === 'object' : true)
        case 'relation':
          return 'id' in element
            && typeof element.id === 'number'
            && 'members' in element
            && Array.isArray(element.members)
            && element.members.every((member: unknown) => {
              return typeof member === 'object'
                && member !== null
                && 'type' in member
                && typeof member.type === 'string'
                && 'ref' in member
                && typeof member.ref === 'number'
                && 'role' in member
                && typeof member.role === 'string'
            })
        default:
          return false
      }
    })
}

export class OverpassClient {
  public constructor(
    private baseUrl: string
  ) { }

  private post = (path: string, formData: Record<string, string | number>) => {
    return got.post(`${this.baseUrl}${path}`, {
      form: formData,
    }).json()
  }

  public async shortRangeNamed (params: ReturnType<typeof OverpassInterpreter.QueryInput['toObject']>): Promise<InterpreterResponse> {
    const result = await this.post('/interpreter', {data: await Query.ShortRangeNamed.create(params)})

    if (!isInterpreterResponse(result)) {
      throw new Error('Invalid response from interpreter')
    }

    return result
  }
}
