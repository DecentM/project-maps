import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const road_motorway_link_casing: StyleComponent = (config) =>
  ({
    id: 'road_motorway_link_casing',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    minzoom: 12,
    filter: [
      'all',
      ['!in', 'brunnel', 'bridge', 'tunnel'],
      ['==', 'class', 'motorway'],
      ['==', 'ramp', 1],
    ],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': '#e9ac77',
      'line-width': {
        base: 1.2,
        stops: [
          [12, 1],
          [13, 3],
          [14, 4],
          [20, 15],
        ],
      },
    },
  }) as unknown as LayerSpecification
