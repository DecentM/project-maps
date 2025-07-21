import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const bridge_secondary_tertiary = (config: StyleConfig) =>
  ({
    id: 'bridge_secondary_tertiary',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: ['all', ['==', 'brunnel', 'bridge'], ['in', 'class', 'secondary', 'tertiary']],
    layout: { 'line-join': 'round' },
    paint: {
      'line-color': '#fea',
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
