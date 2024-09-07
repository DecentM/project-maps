import type { Socket } from "socket.io"

import type { ClientToServerEvents, ServerToClientEvents } from "../declarations/socketio"

import { handleLocationImages } from "./location-images"

export const attachSocketRoutes = (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
  socket.on('LocationImages', handleLocationImages(socket))
}
