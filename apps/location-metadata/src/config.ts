export const config = {
  imageSources: {
    geographUK: {
      baseUrl: 'https://www.geograph.org.uk',
      apiKey: process.env.GEOGRAPH_UK_API_KEY ?? 'fixme',
    },
  },

  grpcServer: {
    host: process.env.GRPC_SERVER_HOST ?? '',
    port: Number.parseFloat(process.env.GRPC_SERVER_PORT ?? '50051'),
  },
} as const
