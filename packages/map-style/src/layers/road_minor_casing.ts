import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const road_minor_casing = (config: StyleConfig) =>
  ({
    id: 'road_minor_casing',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: [
      'all',
      ['==', '$type', 'LineString'],
      ['!in', 'brunnel', 'bridge', 'tunnel'],
      ['in', 'class', 'minor'],
      ['!=', 'ramp', 1],
    ],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
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
          [20, 20],
        ],
      },
    },
  }) as unknown as LayerSpecification
