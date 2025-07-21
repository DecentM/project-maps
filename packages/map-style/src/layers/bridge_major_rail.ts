import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const bridge_major_rail = (config: StyleConfig) =>
  ({
    id: 'bridge_major_rail',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: ['all', ['==', 'class', 'rail'], ['==', 'brunnel', 'bridge']],
    paint: {
      'line-color': '#bbb',
      'line-width': {
        base: 1.4,
        stops: [
          [14, 0.4],
          [15, 0.75],
          [20, 2],
        ],
      },
    },
  }) as unknown as LayerSpecification
