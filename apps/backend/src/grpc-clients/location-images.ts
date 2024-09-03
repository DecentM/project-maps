import { LocationImages } from '@project-maps/proto/location-images'
import { credentials } from '@grpc/grpc-js'

import { config } from 'src/config'

export const locationImagesClient = new LocationImages.LocationImagesClient(
  `${config.rpc.clients.locationImages.host}:${config.rpc.clients.locationImages.port}`,
  credentials.createInsecure()
)
