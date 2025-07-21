import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const tunnel_path_pedestrian = (config: StyleConfig) =>
  ({
    id: 'tunnel_path_pedestrian',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: [
      'all',
      ['==', '$type', 'LineString'],
      ['==', 'brunnel', 'tunnel'],
      ['in', 'class', 'path', 'pedestrian'],
    ],
    paint: {
      'line-color': 'hsl(0, 0%, 100%)',
      'line-dasharray': [1, 0.75],
      'line-width': {
        base: 1.2,
        stops: [
          [14, 0.5],
          [20, 10],
        ],
      },
    },
  }) as unknown as LayerSpecification
