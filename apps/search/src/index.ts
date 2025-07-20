import { log } from '@project-maps/logging'
import { Server, ServerCredentials } from '@grpc/grpc-js'

import { config } from './config'
import { SearchService } from './service'

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

server.addService(SearchService.definition, new SearchService())

startServer(server)
  .then(() => {
    log.info(config.grpcServer, 'Server started')
  })
  .catch((error) => {
    log.error(error, 'Failed to start server')
  })
