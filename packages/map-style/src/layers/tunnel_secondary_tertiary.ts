import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const tunnel_secondary_tertiary: StyleComponent = (config) =>
  ({
    id: 'tunnel_secondary_tertiary',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'secondary', 'tertiary']],
    layout: { 'line-join': 'round' },
    paint: {
      'line-color': '#fff4c6',
      'line-width': {
        base: 1.2,
        stops: [
          [6.5, 0],
          [7, 0.5],
          [20, 10],
        ],
      },
    },
  }) as unknown as LayerSpecification
