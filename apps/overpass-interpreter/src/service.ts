import type { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js'
import { OverpassInterpreter } from '@project-maps/proto/overpass-interpreter'

import { OverpassClient } from './clients/overpass'
import { config } from './config'

const client = new OverpassClient(config.overpassApi.baseUrl)

export class OverpassInterpreterService extends OverpassInterpreter.UnimplementedOverpassInterpreterService {
  override Query(
    call: ServerUnaryCall<OverpassInterpreter.QueryInput, OverpassInterpreter.QueryResult>,
    callback: sendUnaryData<OverpassInterpreter.QueryResult>
  ): void {
    callback(null, OverpassInterpreter.QueryResult.fromObject({
      elements: []
    }))
  }
}
