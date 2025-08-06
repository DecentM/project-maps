import { Server, ServerCredentials } from '@grpc/grpc-js'

import { log } from '@project-maps/logging'

import { MetadataService } from './service'
import { config } from './config'

const startServer = (server: Server): Promise<void> => {
  return new Promise((resolve, reject) => {
    server.bindAsync(
      `${config.grpcServer.host}:${config.grpcServer.port}`,
      ServerCredentials.createInsecure(),
      (error) => {
        if (error) return reject(error)
        return resolve()
      }
    )
  })
}

const server = new Server()

server.addService(MetadataService.definition, new MetadataService())

startServer(server)
  .then(() => {
    log.info(config.grpcServer, 'Server listening')
  })
  // TODO ESM
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch((error) => {
    console.error('Failed to start server:', error)
  })

process.on('unhandledRejection', (error) => {
  console.error(error)
})

process.on('uncaughtException', (error) => {
  console.error(error)
})
