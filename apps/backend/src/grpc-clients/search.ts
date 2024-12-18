import { Search } from '@project-maps/proto/search'
import { credentials } from '@grpc/grpc-js'

import { config } from '../config'

export const searchClient = new Search.SearchClient(
  `${config.rpc.clients.search.host}:${config.rpc.clients.search.port}`,
  credentials.createInsecure()
)
