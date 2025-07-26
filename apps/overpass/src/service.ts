import type { ServerWritableStream } from '@grpc/grpc-js'
import {
  UnimplementedOverpassService,
  type QueryParameters,
  WikidataId,
  type PoiMetadataParameters,
} from '@project-maps/proto/overpass/node'
import { Element } from '@project-maps/proto/lib/openstreetmap/node'

import { OverpassClient } from './clients/overpass'
import { config } from './config'

const client = new OverpassClient(config.overpassApi.baseUrl)

export class OverpassService extends UnimplementedOverpassService {
  private static processLines(
    lines: string[],
    parameters: {
      tags?: string[]
    },
    onResult: (result: Element) => void
  ) {
    while (lines.length > 0) {
      // Leave the last line in the buffer as it may be incomplete
      const line = lines.shift()
      if (!line) continue

      const [id, type, lat, lon, ...columns] = line.split(';')

      if (!parameters.tags?.length || columns.length < parameters.tags.length) {
        throw new Error('Not enough columns in the response')
      }

      const tags = columns.reduce(
        (acc, column, index) => {
          acc[parameters.tags![index]] = column
          return acc
        },
        {} as Record<string, string>
      )

      if (type === 'way') {
        onResult(
          Element.fromObject({
            way: {
              id: Number.parseInt(id, 10),
              tags,
            },
          })
        )
        continue
      }

      if (type === 'node') {
        onResult(
          Element.fromObject({
            node: {
              id: Number.parseInt(id, 10),
              lat: Number.parseFloat(lat),
              lon: Number.parseFloat(lon),
              tags,
            },
          })
        )
        continue
      }

      if (type === 'relation') {
        onResult(
          Element.fromObject({
            relation: {
              id: Number.parseInt(id, 10),
              tags,
            },
          })
        )
      }
    }
  }

  override ShortRangeNamed(call: ServerWritableStream<QueryParameters, Element>): void {
    const params = call.request.toObject()

    const stream = client.shortRangeNamedStreaming({
      range: params.range ?? 0,
      coordinates: {
        lat: params.coordinates?.lat ?? 0,
        lng: params.coordinates?.lng ?? 0,
      },
      tags: params.tags ?? [],
    })

    let response = ''

    const lines: string[] = []
    let partialLine = ''

    stream.on('data', (chunk: Buffer) => {
      response += chunk.toString('utf-8')
      const responseLines = response.split('\n')
      const firstResponseLine = responseLines.shift()
      const lastResponseLine = responseLines.pop()

      partialLine += firstResponseLine
      lines.push(partialLine, ...responseLines)
      partialLine = lastResponseLine || ''

      OverpassService.processLines(lines, params, (result) => {
        call.write(result)
      })
    })

    stream.on('end', () => {
      call.end()
    })
  }

  override WikidataIdsInRange(call: ServerWritableStream<QueryParameters, WikidataId>): void {
    const params = call.request.toObject()

    const stream = client.wikidataIdsInRangeStreaming({
      range: params.range ?? 0,
      coordinates: {
        lat: params.coordinates?.lat ?? 0,
        lng: params.coordinates?.lng ?? 0,
      },
      tags: params.tags ?? [],
    })

    let response = ''
    const lines: string[] = []
    const requestedTags = params.tags ?? []

    const processLines = () => {
      while (lines.length > 0) {
        // Leave the last line in the buffer as it may be incomplete
        const line = lines.shift()
        if (!line) continue

        const [, , , , ...columns] = line.split(';')

        if (columns.length < requestedTags.length) {
          throw new Error('Not enough columns in the response')
        }

        const tags = columns.reduce(
          (acc, column, index) => {
            acc[requestedTags[index]] = column
            return acc
          },
          {} as Record<string, string>
        )

        call.write(
          WikidataId.fromObject({
            id: tags.wikidata || tags['brand:wikidata'],
          })
        )
      }
    }

    let partialLine = ''

    stream.on('data', (chunk: Buffer) => {
      response += chunk.toString('utf-8')
      const responseLines = response.split('\n')
      const firstResponseLine = responseLines.shift()
      const lastResponseLine = responseLines.pop()

      partialLine += firstResponseLine
      lines.push(partialLine, ...responseLines)
      partialLine = lastResponseLine || ''

      processLines()
    })

    stream.on('end', () => {
      call.end()
    })
  }

  override PoiMetadata(call: ServerWritableStream<PoiMetadataParameters, Element>): void {
    const parameters = call.request.toObject()

    if (!parameters.ids || parameters.ids.length === 0) {
      call.end()
      return
    }

    const stream = client.poiMetadataStreaming({
      ids: parameters.ids,
      tags: parameters.tags ?? [],
    })

    let response = ''

    const lines: string[] = []
    let partialLine = ''

    stream.on('data', (chunk: Buffer) => {
      response += chunk.toString('utf-8')
      const responseLines = response.split('\n')
      const firstResponseLine = responseLines.shift()
      const lastResponseLine = responseLines.pop()

      partialLine += firstResponseLine
      lines.push(partialLine, ...responseLines)
      partialLine = lastResponseLine || ''

      OverpassService.processLines(lines, parameters, (result) => {
        call.write(result)
      })
    })

    stream.on('end', () => {
      call.end()
    })
  }

  override PoiWikidataId(call: ServerWritableStream<PoiMetadataParameters, WikidataId>): void {
    const parameters = call.request.toObject()

    if (!parameters.ids || parameters.ids.length === 0) {
      call.end()
      return
    }

    const stream = client.poiWikidataIdStreaming({
      ids: parameters.ids,
      tags: parameters.tags ?? [],
    })

    let response = ''
    const lines: string[] = []
    const requestedTags = parameters.tags ?? []

    const processLines = () => {
      while (lines.length > 0) {
        // Leave the last line in the buffer as it may be incomplete
        const line = lines.shift()
        if (!line) continue

        const [, , , , ...columns] = line.split(';')

        if (columns.length < requestedTags.length) {
          throw new Error('Not enough columns in the response')
        }

        const tags = columns.reduce(
          (acc, column, index) => {
            acc[requestedTags[index]] = column
            return acc
          },
          {} as Record<string, string>
        )

        call.write(
          WikidataId.fromObject({
            id: tags.wikidata || tags['brand:wikidata'],
          })
        )
      }
    }

    let partialLine = ''

    stream.on('data', (chunk: Buffer) => {
      response += chunk.toString('utf-8')
      const responseLines = response.split('\n')
      const firstResponseLine = responseLines.shift()
      const lastResponseLine = responseLines.pop()

      partialLine += firstResponseLine
      lines.push(partialLine, ...responseLines)
      partialLine = lastResponseLine || ''

      processLines()
    })

    stream.on('end', () => {
      call.end()
    })
  }
}
