import { OverpassInterpreter } from '@project-maps/proto/overpass-interpreter'
import { credentials } from '@grpc/grpc-js'

import { config } from '../config'

export const overpassInterpreterClient = new OverpassInterpreter.OverpassInterpreterClient(
  `${config.rpc.clients.locationImages.host}:${config.rpc.clients.locationImages.port}`,
  credentials.createInsecure()
)
