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

    wikimapia: {
      baseUrl: 'http://api.wikimapia.org',
      apiKey: process.env.WIKIMAPIA_API_KEY ?? 'fixme',
    },

    mapillary: {
      baseUrl: 'https://graph.mapillary.com',
      apiKey: process.env.MAPILLARY_CLIENT_TOKEN ?? 'fixme',
    },
  },

  grpcServer: {
    host: process.env.GRPC_SERVER_HOST ?? '',
    port: Number.parseFloat(process.env.GRPC_SERVER_PORT ?? '50051'),
  },
} as const
