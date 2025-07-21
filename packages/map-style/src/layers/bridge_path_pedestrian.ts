import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const bridge_path_pedestrian = (config: StyleConfig) =>
  ({
    id: 'bridge_path_pedestrian',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: [
      'all',
      ['==', '$type', 'LineString'],
      ['==', 'brunnel', 'bridge'],
      ['in', 'class', 'path', 'pedestrian'],
    ],
    paint: {
      'line-color': 'hsl(0, 0%, 100%)',
      'line-dasharray': [1, 0.3],
      'line-width': {
        base: 1.2,
        stops: [
          [14, 0.5],
          [20, 10],
        ],
      },
    },
  }) as unknown as LayerSpecification
