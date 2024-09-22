import type { LayerSpecification } from 'maplibre-gl'

export const tunnel_minor: LayerSpecification = {
  id: 'tunnel_minor',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'minor']],
  layout: {
    'line-join': 'round',
  },
} as LayerSpecification
