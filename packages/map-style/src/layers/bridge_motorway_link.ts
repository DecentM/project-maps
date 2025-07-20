import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const bridge_motorway_link: StyleComponent = (config) =>
  ({
    id: 'bridge_motorway_link',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: ['all', ['==', 'class', 'motorway'], ['==', 'ramp', 1], ['==', 'brunnel', 'bridge']],
    layout: { 'line-join': 'round' },
    paint: {
      'line-color': '#fc8',
      'line-width': {
        base: 1.2,
        stops: [
          [12.5, 0],
          [13, 1.5],
          [14, 2.5],
          [20, 11.5],
        ],
      },
    },
  }) as unknown as LayerSpecification
