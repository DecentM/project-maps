import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const road_secondary_tertiary = (config: StyleConfig) =>
  ({
    id: 'road_secondary_tertiary',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: [
      'all',
      ['!in', 'brunnel', 'bridge', 'tunnel'],
      ['in', 'class', 'secondary', 'tertiary'],
    ],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': '#fea',
      'line-width': {
        base: 1.2,
        stops: [
          [6.5, 0],
          [8, 0.5],
          [20, 13],
        ],
      },
    },
  }) as unknown as LayerSpecification
