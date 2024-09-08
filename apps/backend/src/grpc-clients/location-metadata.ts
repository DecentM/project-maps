import { LocationMetadata } from '@project-maps/proto/location-metadata'
import { credentials } from '@grpc/grpc-js'

import { config } from '../config'

export const locationMetadataClient = new LocationMetadata.LocationMetadataClient(
  `${config.rpc.clients.locationImages.host}:${config.rpc.clients.locationImages.port}`,
  credentials.createInsecure()
)
