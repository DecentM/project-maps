import { MetadataClient } from '@project-maps/proto/metadata/node'
import { credentials } from '@grpc/grpc-js'

import { config } from '../config'

export const metadataClient = new MetadataClient(
  `${config.rpc.clients.metadata.host}:${config.rpc.clients.metadata.port}`,
  credentials.createInsecure()
)
