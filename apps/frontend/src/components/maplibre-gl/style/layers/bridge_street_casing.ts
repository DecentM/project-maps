import type { LayerSpecification } from 'maplibre-gl'

export const bridge_street_casing: LayerSpecification = {
  id: 'bridge_street_casing',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'brunnel', 'bridge'], ['in', 'class', 'street', 'street_limited']],
  layout: {
    'line-join': 'round',
  },
} as LayerSpecification
