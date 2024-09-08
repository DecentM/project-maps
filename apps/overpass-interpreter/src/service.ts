import type { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js'
import { OverpassInterpreter } from '@project-maps/proto/overpass-interpreter'

import { OverpassClient, type InterpreterResponse } from './clients/overpass'
import { config } from './config'
import { OpenStreetMap } from '@project-maps/proto/lib/openstreetmap'

const client = new OverpassClient(config.overpassApi.baseUrl)

export class OverpassInterpreterService extends OverpassInterpreter.UnimplementedOverpassInterpreterService {
  override Query(
    call: ServerUnaryCall<OverpassInterpreter.QueryInput, OverpassInterpreter.QueryResult>,
    callback: sendUnaryData<OverpassInterpreter.QueryResult>
  ): void {
    let promise: Promise<InterpreterResponse> | null = null

    if (call.request.has_shortRangeNamedQueryParameters) {
      promise = client.shortRangeNamed(call.request.shortRangeNamedQueryParameters.toObject())
    }

    if (!promise) {
      callback(new Error('Invalid query input'))
      return
    }

    promise
      .then((response) => {
        callback(
          null,
          OverpassInterpreter.QueryResult.fromObject({
            elements: response.elements
              .map((element) => {
                if (element.type === 'way') {
                  return {
                    way: {
                      type: OpenStreetMap.Member.Type.WAY,
                      id: element.id,
                      nodes: element.nodes,
                      tags: element.tags,
                    },
                  }
                }

                if (element.type === 'node') {
                  return {
                    node: {
                      type: OpenStreetMap.Member.Type.NODE,
                      id: element.id,
                      tags: element.tags,
                      lat: element.lat,
                      lon: element.lon,
                    },
                  }
                }

                if (element.type === 'relation') {
                  return {
                    relation: {
                      type: OpenStreetMap.Member.Type.RELATION,
                      id: element.id,
                      members: element.members
                        .map((member) => {
                          if (member.type === 'node') {
                            return {
                              type: OpenStreetMap.Member.Type.NODE,
                              id: member.ref,
                              role: member.role,
                            }
                          }

                          if (member.type === 'way') {
                            return {
                              type: OpenStreetMap.Member.Type.WAY,
                              id: member.ref,
                              role: member.role,
                            }
                          }

                          if (member.type === 'relation') {
                            return {
                              type: OpenStreetMap.Member.Type.RELATION,
                              id: member.ref,
                              role: member.role,
                            }
                          }

                          return null
                        })
                        .filter((element) => element !== null),
                      tags: element.tags,
                    },
                  }
                }

                return null
              })
              .filter((element) => element !== null),
          })
        )
      })
      .catch((error) => {
        console.error(error)
        callback(error)
      })
  }
}
