import { io, type Socket } from 'socket.io-client'
import { onBeforeUnmount, onMounted } from 'vue'
import type { ClientToServerEvents, ServerToClientEvents } from '@project-maps/backend'

export const useSocket = () => {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
    `ws://${window.location.hostname}:3000`,
    {
      reconnectionDelayMax: 30000,
      autoConnect: false,
    }
  )

  onMounted(() => {
    socket.connect()
  })

  onBeforeUnmount(() => {
    socket.disconnect()
  })

  socket.on('connect', () => {
    console.log('socketio connected')
  })

  return {
    socket,
  }
}
