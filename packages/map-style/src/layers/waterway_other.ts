import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const waterway_other = (config: StyleConfig) =>
  ({
    id: 'waterway_other',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'waterway',
    filter: ['all', ['!=', 'class', 'river'], ['!=', 'brunnel', 'tunnel']],
    layout: { 'line-cap': 'round' },
    paint: {
      'line-color': '#a0c8f0',
      'line-width': {
        base: 1.3,
        stops: [
          [13, 0.5],
          [20, 6],
        ],
      },
    },
  }) as unknown as LayerSpecification
