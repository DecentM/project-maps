import type { LayerSpecification } from 'maplibre-gl'

export const tunnel_link_casing: LayerSpecification = {
  id: 'tunnel_link_casing',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'ramp', 1], ['==', 'brunnel', 'tunnel']],
  layout: {
    'line-join': 'round',
  },
} as LayerSpecification
