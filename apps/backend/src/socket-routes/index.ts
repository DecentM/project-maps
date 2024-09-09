import type { Socket } from "socket.io"

import { handleMetadata } from "./metadata"

export const attachSocketRoutes = (socket: Socket) => {
  socket.on('Metadata', handleMetadata(socket))
}
