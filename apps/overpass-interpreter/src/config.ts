export const config = {
  overpassApi: {
    baseUrl: process.env.OVERPASS_API_BASE_URL ?? '',
  },

  grpcServer: {
    host: process.env.GRPC_SERVER_HOST ?? '',
    port: Number.parseFloat(process.env.GRPC_SERVER_PORT ?? '50051'),
  },
} as const
