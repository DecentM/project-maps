import type { LayerSpecification } from 'maplibre-gl'

import type { StyleComponent } from '..'

export const road_service_track: StyleComponent = (config) =>
  ({
    id: 'road_service_track',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['in', 'class', 'service', 'track']],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': '#fff',
      'line-width': {
        base: 1.2,
        stops: [
          [15.5, 0],
          [16, 2],
          [20, 7.5],
        ],
      },
    },
  }) as unknown as LayerSpecification
