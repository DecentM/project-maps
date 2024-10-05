import type { LayerSpecification } from 'maplibre-gl'

export const tunnel_service_track_casing: LayerSpecification = {
  id: 'tunnel_service_track_casing',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'service', 'track']],
  layout: { 'line-join': 'round' },
  paint: {
    'line-color': '#cfcdca',
    'line-dasharray': [0.5, 0.25],
    'line-width': {
      base: 1.2,
      stops: [
        [15, 1],
        [16, 4],
        [20, 11],
      ],
    },
  },
} as unknown as LayerSpecification
