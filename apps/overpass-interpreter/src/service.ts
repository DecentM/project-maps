import type { ServerWritableStream } from '@grpc/grpc-js'
import { OverpassInterpreter } from '@project-maps/proto/overpass-interpreter'

import { OverpassClient } from './clients/overpass'
import { config } from './config'

const client = new OverpassClient(config.overpassApi.baseUrl)

export class OverpassInterpreterService extends OverpassInterpreter.UnimplementedOverpassInterpreterService {
  override ShortRangeNamed(
    call: ServerWritableStream<OverpassInterpreter.QueryParameters, OverpassInterpreter.ShortRangeNamedResult>
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

    const processLines = () => {
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
          call.write(
            OverpassInterpreter.ShortRangeNamedResult.fromObject({
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
          call.write(
            OverpassInterpreter.ShortRangeNamedResult.fromObject({
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
          call.write(
            OverpassInterpreter.ShortRangeNamedResult.fromObject({
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
}
