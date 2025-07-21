import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const road_motorway_casing = (config: StyleConfig) =>
  ({
    id: 'road_motorway_casing',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    minzoom: 5,
    filter: [
      'all',
      ['!in', 'brunnel', 'bridge', 'tunnel'],
      ['==', 'class', 'motorway'],
      ['!=', 'ramp', 1],
    ],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': '#e9ac77',
      'line-width': {
        base: 1.2,
        stops: [
          [5, 0.4],
          [6, 0.7],
          [7, 1.75],
          [20, 22],
        ],
      },
    },
  }) as unknown as LayerSpecification
