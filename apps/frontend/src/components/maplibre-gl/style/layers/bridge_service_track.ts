import type { LayerSpecification } from 'maplibre-gl'

export const bridge_service_track: LayerSpecification = {
  id: 'bridge_service_track',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'brunnel', 'bridge'], ['in', 'class', 'service', 'track']],
  layout: {
    'line-join': 'round',
  },
} as LayerSpecification
