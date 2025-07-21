import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const bridge_service_track = (config: StyleConfig) =>
  ({
    id: 'bridge_service_track',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: ['all', ['==', 'brunnel', 'bridge'], ['in', 'class', 'service', 'track']],
    layout: { 'line-join': 'round' },
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
