import type { Server } from 'socket.io'

import type { ClientToServerEvents, ServerToClientEvents } from './declarations/socketio'

declare module 'fastify' {
  interface FastifyInstance {
    io: Server<ClientToServerEvents, ServerToClientEvents>
  }
}
