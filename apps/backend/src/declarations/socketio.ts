import type { ClientReadableStream } from '@grpc/grpc-js'
import type {
  MappedDataByMethod,
  MappedMethodNameByService,
  MappedReturnTypeByMethod,
  MappedService,
} from '../lib/rpc-to-service-map'

export type ServerToClientEvents = {
  [key in MappedService]: (
    method: MappedMethodNameByService<key>,
    data: MappedReturnTypeByMethod<
      MappedService,
      key extends MappedService ? MappedMethodNameByService<key> : never
    > extends ClientReadableStream<infer T>
      ? T
      : never
  ) => void
}

export type ClientToServerData<key extends MappedService> = ReturnType<
  MappedDataByMethod<
    MappedService,
    key extends MappedService ? MappedMethodNameByService<key> : never
  >['toObject']
>

export type ClientToServerEvents = {
  [key in MappedService]: (
    method: MappedMethodNameByService<key>,
    data: ClientToServerData<key>
  ) => void
}
