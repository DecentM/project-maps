import type { LayerSpecification } from 'maplibre-gl'

export const tunnel_service_track: LayerSpecification = {
  id: 'tunnel_service_track',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'service', 'track']],
  layout: {
    'line-join': 'round',
  },
} as LayerSpecification
