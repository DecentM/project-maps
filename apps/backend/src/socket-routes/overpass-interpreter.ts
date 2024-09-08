import { OverpassInterpreter } from '@project-maps/proto/overpass-interpreter'

import type {
  ClientToServerData,
  ClientToServerEvents,
  ServerToClientEvents,
} from '../declarations/socketio'
import { rpcToServiceMap, type MappedMethodNameByService } from '../lib/rpc-to-service-map'
import type { Socket } from 'socket.io'

export const handleOverpassInterpreter =
  (socket: Socket<ClientToServerEvents, ServerToClientEvents>) =>
  async (
    method: MappedMethodNameByService<'OverpassInterpreter'>,
    data: ClientToServerData<'OverpassInterpreter'>
  ) => {
    const [, client] = rpcToServiceMap.OverpassInterpreter

    switch (method) {
      case 'Query': {
        const result = client.GetOverpassInterpreter(
          OverpassInterpreter.QueryInput.fromObject(data)
        )

        result.on('data', (data) => {
          socket.emit('OverpassInterpreter', method, data.toObject())
        })

        result.on('error', (error) => {
          console.error(error)
        })
        break
      }
      default:
        throw new Error(`Method ${method} not implemented`)
    }
  }
