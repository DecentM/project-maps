import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const bridge_path_pedestrian_casing: StyleComponent = (config) =>
  ({
    id: 'bridge_path_pedestrian_casing',
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
      'line-color': 'hsl(35, 6%, 80%)',
      'line-dasharray': [1, 0],
      'line-width': {
        base: 1.2,
        stops: [
          [14, 1.5],
          [20, 18],
        ],
      },
    },
  }) as unknown as LayerSpecification
