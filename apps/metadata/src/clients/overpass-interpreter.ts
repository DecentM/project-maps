import { OverpassInterpreter } from '@project-maps/proto/overpass-interpreter'
import { credentials } from '@grpc/grpc-js'

import { config } from '../config'

export const overpassClient = new OverpassInterpreter.OverpassInterpreterClient(
  `${config.clients.overpassInterpreter.host}:${config.clients.overpassInterpreter.port}`,
  credentials.createInsecure()
)
