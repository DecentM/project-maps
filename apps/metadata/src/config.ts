export const config = {
  clients: {
    geographUK: {
      baseUrl: 'https://www.geograph.org.uk',
      apiKey: process.env.GEOGRAPH_UK_API_KEY ?? 'fixme',
    },

    wikimapia: {
      baseUrl: 'http://api.wikimapia.org',
      apiKey: process.env.WIKIMAPIA_API_KEY ?? 'fixme',
    },

    mapillary: {
      baseUrl: 'https://graph.mapillary.com',
      apiKey: process.env.MAPILLARY_CLIENT_TOKEN ?? 'fixme',
    },

    nominatim: {
      endpoint: process.env.SEARCH_NOMINATIM_ENDPOINT || 'fixme',
    },
  },

  grpcServer: {
    host: process.env.GRPC_METADATA_HOST ?? 'fixme',
    port: Number.parseFloat(process.env.GRPC_METADATA_PORT ?? 'fixme'),
  },

  userAgent: process.env.OUTGOING_USER_AGENT,
} as const
