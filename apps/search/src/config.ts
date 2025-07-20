export const config = {
  nominatim: {
    endpoint: process.env.SEARCH_NOMINATIM_ENDPOINT || 'fixme',
  },
  grpcServer: {
    host: process.env.GRPC_SEARCH_HOST ?? 'fixme',
    port: Number.parseFloat(process.env.GRPC_SEARCH_PORT ?? 'fixme'),
  },
} as const
