export const config = {
  overpassApi: {
    baseUrl: process.env.OVERPASS_API_BASE_URL ?? 'fixme',
  },

  grpcServer: {
    host: process.env.GRPC_OVERPASS_INTERPRETER_HOST ?? 'fixme',
    port: Number.parseFloat(process.env.GRPC_OVERPASS_INTERPRETER_PORT ?? 'fixme'),
  },
} as const
