export const config = {
  overpassApi: {
    baseUrl: process.env.OVERPASS_API_BASE_URL ?? '',
  },

  grpcServer: {
    host: process.env.GRPC_OVERPASS_INTERPRETER_HOST ?? '127.0.0.1',
    port: Number.parseFloat(process.env.GRPC_OVERPASS_INTERPRETER_PORT ?? '50052'),
  },
} as const
