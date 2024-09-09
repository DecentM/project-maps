import { Server, ServerCredentials } from '@grpc/grpc-js'

import { config } from './config';
import { OverpassInterpreterService } from './service';

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

server.addService(OverpassInterpreterService.definition, new OverpassInterpreterService())

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

process.on('uncaughtException', (error) => {
  console.error(error)
})
