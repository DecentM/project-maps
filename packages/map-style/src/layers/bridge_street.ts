import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const bridge_street: StyleComponent = (config) =>
  ({
    id: 'bridge_street',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: ['all', ['==', 'brunnel', 'bridge'], ['in', 'class', 'minor']],
    layout: { 'line-join': 'round' },
    paint: {
      'line-color': '#fff',
      'line-width': {
        base: 1.2,
        stops: [
          [13.5, 0],
          [14, 2.5],
          [20, 18],
        ],
      },
    },
  }) as unknown as LayerSpecification
