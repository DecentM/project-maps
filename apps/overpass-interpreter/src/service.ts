import type { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js'
import { OverpassInterpreter } from '@project-maps/proto/overpass-interpreter'

import { OverpassClient, type InterpreterResponse } from './clients/overpass'
import { config } from './config'

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
            elements: response.elements.map((element) => {
              if (element.type === 'node') return { node: element }
              if (element.type === 'way') return { way: element }
              if (element.type === 'relation') return { relation: element }

              throw new Error(`Unknown element type: ${element.type}`)
            }),
          })
        )
      })
      .catch((error) => {
        callback(error)
      })
  }
}
