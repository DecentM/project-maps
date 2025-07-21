import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const road_link = (config: StyleConfig) =>
  ({
    id: 'road_link',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    minzoom: 13,
    filter: [
      'all',
      ['!in', 'brunnel', 'bridge', 'tunnel'],
      ['==', 'ramp', 1],
      ['!in', 'class', 'pedestrian', 'path', 'track', 'service', 'motorway'],
    ],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': '#fea',
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
