import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const tunnel_motorway = (config: StyleConfig) =>
  ({
    id: 'tunnel_motorway',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: ['all', ['==', 'class', 'motorway'], ['!=', 'ramp', 1], ['==', 'brunnel', 'tunnel']],
    layout: { 'line-join': 'round' },
    paint: {
      'line-color': '#ffdaa6',
      'line-width': {
        base: 1.2,
        stops: [
          [5, 0],
          [7, 1],
          [20, 18],
        ],
      },
    },
  }) as unknown as LayerSpecification
