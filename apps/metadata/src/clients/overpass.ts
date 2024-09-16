import { Overpass } from '@project-maps/proto/overpass'
import { credentials } from '@grpc/grpc-js'

import { config } from '../config'

export const overpassClient = new Overpass.OverpassClient(
  `${config.clients.overpassInterpreter.host}:${config.clients.overpassInterpreter.port}`,
  credentials.createInsecure()
)
