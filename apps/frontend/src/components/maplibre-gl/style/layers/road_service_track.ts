import type { LayerSpecification } from 'maplibre-gl'

export const road_service_track: LayerSpecification = {
  id: 'road_service_track',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['in', 'class', 'service', 'track']],
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
} as LayerSpecification
