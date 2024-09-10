import type { ServerWritableStream } from '@grpc/grpc-js'
import { OverpassInterpreter } from '@project-maps/proto/overpass-interpreter'
import { OpenStreetMap } from '@project-maps/proto/lib/openstreetmap'

import { OverpassClient } from './clients/overpass'
import { config } from './config'

const client = new OverpassClient(config.overpassApi.baseUrl)

export class OverpassInterpreterService extends OverpassInterpreter.UnimplementedOverpassInterpreterService {
  private static processLines(
    lines: string[],
    onResult: (result: OpenStreetMap.Element) => void
  ) {
    while (lines.length > 0) {
      // Leave the last line in the buffer as it may be incomplete
      const line = lines.shift()
      if (!line) continue

      const [
        id,
        type,
        lat,
        lon,
        addr_city,
        addr_housenumber,
        addr_postcode,
        addr_state,
        addr_street,
        name,
        name_latin,
        name_en,
        amenity,
        phone,
        website,
      ] = line.split(';')

      if (type === 'way') {
        onResult(
          OpenStreetMap.Element.fromObject({
            way: {
              id: Number.parseInt(id, 10),
              tags: {
                'addr:city': addr_city,
                'addr:housenumber': addr_housenumber,
                'addr:postcode': addr_postcode,
                'addr:state': addr_state,
                'addr:street': addr_street,
                name: name,
                'name:en': name_en,
                'name:latin': name_latin,
                amenity: amenity,
                phone: phone,
                website: website,
              },
            },
          })
        )
        continue
      }

      if (type === 'node') {
        onResult(
          OpenStreetMap.Element.fromObject({
            node: {
              id: Number.parseInt(id, 10),
              lat: Number.parseFloat(lat),
              lon: Number.parseFloat(lon),
              tags: {
                'addr:city': addr_city,
                'addr:housenumber': addr_housenumber,
                'addr:postcode': addr_postcode,
                'addr:state': addr_state,
                'addr:street': addr_street,
                name: name,
                'name:en': name_en,
                'name:latin': name_latin,
                amenity: amenity,
                phone: phone,
                website: website,
              },
            },
          })
        )
        continue
      }

      if (type === 'relation') {
        onResult(
          OpenStreetMap.Element.fromObject({
            relation: {
              id: Number.parseInt(id, 10),
              tags: {
                'addr:city': addr_city,
                'addr:housenumber': addr_housenumber,
                'addr:postcode': addr_postcode,
                'addr:state': addr_state,
                'addr:street': addr_street,
                name: name,
                'name:en': name_en,
                'name:latin': name_latin,
                amenity: amenity,
                phone: phone,
                website: website,
              },
            },
          })
        )
      }
    }
  }

  override ShortRangeNamed(
    call: ServerWritableStream<OverpassInterpreter.QueryParameters, OpenStreetMap.Element>
  ): void {
    const params = call.request.toObject()

    const stream = client.shortRangeNamedStreaming({
      range: params.range ?? 0,
      coordinates: {
        lat: params.coordinates?.lat ?? 0,
        lng: params.coordinates?.lng ?? 0,
      },
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

      OverpassInterpreterService.processLines(lines, (result) => {
        call.write(result)
      })
    })

    stream.on('end', () => {
      call.end()
    })
  }

  override WikidataIdsInRange(
    call: ServerWritableStream<OverpassInterpreter.QueryParameters, OverpassInterpreter.WikidataId>
  ): void {
    const params = call.request.toObject()

    const stream = client.wikidataIdsInRangeStreaming({
      range: params.range ?? 0,
      coordinates: {
        lat: params.coordinates?.lat ?? 0,
        lng: params.coordinates?.lng ?? 0,
      },
    })

    let response = ''
    const lines: string[] = []

    const processLines = () => {
      while (lines.length > 0) {
        // Leave the last line in the buffer as it may be incomplete
        const line = lines.shift()
        if (!line) continue

        const [wikidata, brand_wikidata] = line.split(';')

        call.write(
          OverpassInterpreter.WikidataId.fromObject({
            id: wikidata || brand_wikidata,
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

  override PoiMetadata(call: ServerWritableStream<OverpassInterpreter.PoiMetadataParameters, OpenStreetMap.Element>): void {
    const parameters = call.request.toObject()

    if (!parameters.id) {
      call.end()
      return
    }

    const stream = client.poiMetadataStreaming({
      id: parameters.id,
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

      OverpassInterpreterService.processLines(lines, (result) => {
        call.write(result)
      })
    })

    stream.on('end', () => {
      call.end()
    })
  }

  override PoiWikidataId(call: ServerWritableStream<OverpassInterpreter.PoiMetadataParameters, OverpassInterpreter.WikidataId>): void {
    const parameters = call.request.toObject()

    if (!parameters.id) {
      call.end()
      return
    }

    const stream = client.poiWikidataIdStreaming({
      id: parameters.id,
    })

    let response = ''
    const lines: string[] = []

    const processLines = () => {
      while (lines.length > 0) {
        // Leave the last line in the buffer as it may be incomplete
        const line = lines.shift()
        if (!line) continue

        const [wikidata, brand_wikidata] = line.split(';')

        call.write(
          OverpassInterpreter.WikidataId.fromObject({
            id: wikidata || brand_wikidata,
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
