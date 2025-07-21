import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const road_service_track_casing = (config: StyleConfig) =>
  ({
    id: 'road_service_track_casing',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['in', 'class', 'service', 'track']],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': '#cfcdca',
      'line-width': {
        base: 1.2,
        stops: [
          [15, 1],
          [16, 4],
          [20, 11],
        ],
      },
    },
  }) as unknown as LayerSpecification
