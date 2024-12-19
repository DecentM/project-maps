import { SearchClient } from '@project-maps/proto/search/node'
import { credentials } from '@grpc/grpc-js'

import { config } from '../config'

export const searchClient = new SearchClient(
  `${config.rpc.clients.search.host}:${config.rpc.clients.search.port}`,
  credentials.createInsecure()
)
