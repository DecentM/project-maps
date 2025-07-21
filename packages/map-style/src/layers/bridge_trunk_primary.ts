import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const bridge_trunk_primary = (config: StyleConfig) =>
  ({
    id: 'bridge_trunk_primary',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: ['all', ['==', 'brunnel', 'bridge'], ['in', 'class', 'primary', 'trunk']],
    layout: { 'line-join': 'round' },
    paint: {
      'line-color': '#fea',
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
