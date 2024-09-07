import type {
  MappedDataByMethod,
  MappedMethodNameByService,
  MappedReturnTypeByMethod,
  MappedService,
} from 'src/lib/rpc-to-service-map'

export type ServerToClientEvents = {
  [key in MappedService]: (
    method: MappedMethodNameByService<key>,
    data: MappedReturnTypeByMethod<
      MappedService,
      key extends MappedService ? MappedMethodNameByService<key> : never
    >
  ) => void
}

export type ClientToServerEvents = {
  [key in MappedService]: (
    method: MappedMethodNameByService<key>,
    data: ReturnType<MappedDataByMethod<
      MappedService,
      key extends MappedService ? MappedMethodNameByService<key> : never
    >['toObject']>
  ) => void
}
