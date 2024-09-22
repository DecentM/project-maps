import type { LayerSpecification } from 'maplibre-gl'

export const tunnel_service_track_casing: LayerSpecification = {
  id: 'tunnel_service_track_casing',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'service', 'track']],
  layout: {
    'line-join': 'round',
  },
} as LayerSpecification
