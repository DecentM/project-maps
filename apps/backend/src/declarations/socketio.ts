import type {
  MappedDataByMethod,
  MappedMethodNameByService,
  MappedService,
} from 'src/lib/rpc-to-service-map'

export type ServerToClientEvents = {
  rpcResponse: (service: MappedService) => void
}

export type ClientToServerEvents = {
  [key in MappedService]: (
    method: MappedMethodNameByService<key>,
    data: MappedDataByMethod<MappedService, key extends MappedService ? MappedMethodNameByService<key> : never>
  ) => void
}
