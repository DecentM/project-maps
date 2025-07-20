import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const bridge_motorway: StyleComponent = (config) =>
  ({
    id: 'bridge_motorway',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: ['all', ['==', 'class', 'motorway'], ['!=', 'ramp', 1], ['==', 'brunnel', 'bridge']],
    layout: { 'line-join': 'round' },
    paint: {
      'line-color': '#fc8',
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
