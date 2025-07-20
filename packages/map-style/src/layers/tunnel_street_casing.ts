import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const tunnel_street_casing: StyleComponent = (config) =>
  ({
    id: 'tunnel_street_casing',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'street', 'street_limited']],
    layout: { 'line-join': 'round' },
    paint: {
      'line-color': '#cfcdca',
      'line-opacity': {
        stops: [
          [12, 0],
          [12.5, 1],
        ],
      },
      'line-width': {
        base: 1.2,
        stops: [
          [12, 0.5],
          [13, 1],
          [14, 4],
          [20, 15],
        ],
      },
    },
  }) as unknown as LayerSpecification
