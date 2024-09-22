import type { LayerSpecification } from 'maplibre-gl'

export const tunnel_street_casing: LayerSpecification = {
  id: 'tunnel_street_casing',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'street', 'street_limited']],
  layout: {
    'line-join': 'round',
  },
} as LayerSpecification
