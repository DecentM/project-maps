import type { LayerSpecification } from 'maplibre-gl'

export const bridge_service_track_casing: LayerSpecification = {
  id: 'bridge_service_track_casing',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'brunnel', 'bridge'], ['in', 'class', 'service', 'track']],
  layout: {
    'line-join': 'round',
  },
} as LayerSpecification
