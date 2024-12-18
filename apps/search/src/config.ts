export const config = {
  meilisearch: {
    host: process.env.SEARCH_MEILI_HOST || "http://localhost:7700",
    apiKey: process.env.SEARCH_MEILI_API_KEY || "",
    maxBatchSize: Number.parseInt(process.env.MEILI_HTTP_PAYLOAD_SIZE_LIMIT || "104857600"),
  },
  recreateIndex: process.env.SEARCH_RECREATE_INDEX === "true",
  indexPbfUrl: process.env.SEARCH_INDEX_PBF_URL || "",
  grpcServer: {
    host: process.env.GRPC_SEARCH_HOST ?? '127.0.0.1',
    port: Number.parseFloat(process.env.GRPC_SEARCH_PORT ?? '50053'),
  },
} as const;
