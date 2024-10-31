export const config = {
  meilisearch: {
    host: process.env.SEARCH_MEILI_HOST || "http://localhost:7700",
    apiKey: process.env.SEARCH_MEILI_API_KEY || "",
  },
  recreateIndex: process.env.SEARCH_RECREATE_INDEX === "true",
  indexPbfUrl: process.env.SEARCH_INDEX_PBF_URL || "",
} as const;
