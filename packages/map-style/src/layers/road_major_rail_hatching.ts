import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const road_major_rail_hatching: StyleComponent = (config) =>
  ({
    id: 'road_major_rail_hatching',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['==', 'class', 'rail']],
    paint: {
      'line-color': '#bbb',
      'line-dasharray': [0.2, 8],
      'line-width': {
        base: 1.4,
        stops: [
          [14.5, 0],
          [15, 3],
          [20, 8],
        ],
      },
    },
  }) as unknown as LayerSpecification
