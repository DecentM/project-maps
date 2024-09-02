import { Server, ServerCredentials } from '@grpc/grpc-js'

import { LocationImagesService } from "./service";
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

server.addService(LocationImagesService.definition, new LocationImagesService())

startServer(server)
  .then(() => {
    console.log(`Server started on ${config.grpcServer.host}:${config.grpcServer.port}`)
  })
  .catch((error) => {
    console.error('Failed to start server:', error)
  })
