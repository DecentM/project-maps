import { metadataClient } from '../grpc-clients/metadata'
import { UnimplementedMetadataService } from '@project-maps/proto/metadata/node'

export const rpcToServiceMap = {
  LocationMetadata: [UnimplementedMetadataService, metadataClient],
} as const

export type MappedService = keyof typeof rpcToServiceMap

export type MappedMethodNameByService<T extends MappedService> =
  keyof (typeof rpcToServiceMap)[T][0]['definition']

export type MappedDataByMethod<
  T extends MappedService,
  M extends MappedMethodNameByService<T>,
> = M extends keyof (typeof rpcToServiceMap)[T][1]
  ? (typeof rpcToServiceMap)[T][1][M] extends (data: infer D) => void
    ? D
    : never
  : never

export type MappedReturnTypeByMethod<
  T extends MappedService,
  M extends MappedMethodNameByService<T>,
> = M extends keyof (typeof rpcToServiceMap)[T][1]
  ? // biome-ignore lint/suspicious/noExplicitAny: causes never
    (typeof rpcToServiceMap)[T][1][M] extends (...args: any[]) => infer R
    ? R
    : never
  : never
