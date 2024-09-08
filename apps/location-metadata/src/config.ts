export const config = {
  clients: {
    geographUK: {
      baseUrl: 'https://www.geograph.org.uk',
      apiKey: process.env.GEOGRAPH_UK_API_KEY ?? 'fixme',
    },

    overpassInterpreter: {
      host: process.env.OVERPASS_INTERPRETER_HOST ?? '127.0.0.1',
      port: Number.parseFloat(process.env.OVERPASS_INTERPRETER_PORT ?? '50052'),
    },
  },

  grpcServer: {
    host: process.env.GRPC_SERVER_HOST ?? '',
    port: Number.parseFloat(process.env.GRPC_SERVER_PORT ?? '50051'),
  },
} as const
