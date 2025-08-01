import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const tints = (config: StyleConfig) =>
  ({
    id: 'tints',
    type: 'raster',
    source: 'tints',
    maxzoom: 6,
    paint: {
      'raster-opacity': {
        base: 1.5,
        stops: [
          [0, 0.6],
          [6, 0.1],
        ],
      },
    },
  }) as unknown as LayerSpecification
