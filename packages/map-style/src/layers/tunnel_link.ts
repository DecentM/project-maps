import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const tunnel_link: StyleComponent = (config) =>
  ({
    id: 'tunnel_link',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: ['all', ['==', 'ramp', 1], ['==', 'brunnel', 'tunnel']],
    layout: { 'line-join': 'round' },
    paint: {
      'line-color': '#fff4c6',
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
