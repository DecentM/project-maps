import type { SourceSpecification } from 'maplibre-gl'

import type { StyleConfig } from '.'

export const createSources = (config: StyleConfig): Record<string, SourceSpecification> => ({
  openmaptiles: {
    type: 'vector',
    url: `${config.tileUrlBase}/metadata.json`,
    tiles: [`${config.tileUrlBase}/{z}/{x}/{y}.pbf`],
  },
  tints: {
    maxzoom: 6,
    tileSize: 256,
    url: `${config.tintsUrlBase}/metadata.json`,
    tiles: [`${config.tintsUrlBase}/{z}/{x}/{y}.png`],
    type: 'raster',
  },
})
