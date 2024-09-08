import type { Socket } from "socket.io"

import type { ClientToServerEvents, ServerToClientEvents } from "../declarations/socketio"

import { handleLocationMetadata } from "./location-metadata"

export const attachSocketRoutes = (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
  socket.on('LocationMetadata', handleLocationMetadata(socket))
}
