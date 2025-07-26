import type { SourceSpecification } from 'maplibre-gl'

import type { StyleConfig } from '.'

export const createSources = (config: StyleConfig): Record<string, SourceSpecification> => ({
  vector: {
    type: 'vector',
    // url: config.tileMetadataUrl,
    tiles: [config.tileUrlPattern],
    maxzoom: 14,
    scheme: 'xyz',
  },
  tints: {
    maxzoom: 6,
    tileSize: 256,
    url: config.tintsMetadataUrl,
    tiles: [config.tintsUrlPattern],
    type: 'raster',
  },
})
