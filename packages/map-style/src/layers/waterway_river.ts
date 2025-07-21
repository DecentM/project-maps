import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const waterway_river = (config: StyleConfig) =>
  ({
    id: 'waterway_river',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'waterway',
    filter: ['all', ['==', 'class', 'river'], ['!=', 'brunnel', 'tunnel']],
    layout: { 'line-cap': 'round' },
    paint: {
      'line-color': '#a0c8f0',
      'line-width': {
        base: 1.2,
        stops: [
          [11, 0.5],
          [20, 6],
        ],
      },
    },
  }) as unknown as LayerSpecification
