import { Server, ServerCredentials } from '@grpc/grpc-js'

import { LocationMetadataService } from "./service";
import { config } from './config';

const startServer = (server: Server): Promise<void> => {
  return new Promise((resolve, reject) => {
    server.bindAsync(
      `${config.grpcServer.host}:${config.grpcServer.port}`,
      ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) return reject(error)
        return resolve()
      }
    )
  })
}

const server = new Server()

server.addService(LocationMetadataService.definition, new LocationMetadataService())

startServer(server)
  .then(() => {
    console.log(`Server started on ${config.grpcServer.host}:${config.grpcServer.port}`)
  })
  .catch((error) => {
    console.error('Failed to start server:', error)
  })

process.on('unhandledRejection', (error) => {
  console.error(error)
})
