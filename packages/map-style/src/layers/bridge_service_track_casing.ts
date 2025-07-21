import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const bridge_service_track_casing = (config: StyleConfig) =>
  ({
    id: 'bridge_service_track_casing',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: ['all', ['==', 'brunnel', 'bridge'], ['in', 'class', 'service', 'track']],
    layout: { 'line-join': 'round' },
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
