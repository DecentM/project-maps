import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const tunnel_major_rail = (config: StyleConfig) =>
  ({
    id: 'tunnel_major_rail',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'rail']],
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
