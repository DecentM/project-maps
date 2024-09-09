import { Metadata } from '@project-maps/proto/metadata'
import { credentials } from '@grpc/grpc-js'

import { config } from '../config'

export const metadataClient = new Metadata.MetadataClient(
  `${config.rpc.clients.metadata.host}:${config.rpc.clients.metadata.port}`,
  credentials.createInsecure()
)
