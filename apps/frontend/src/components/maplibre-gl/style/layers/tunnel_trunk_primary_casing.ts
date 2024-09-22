import type { LayerSpecification } from 'maplibre-gl'

export const tunnel_trunk_primary_casing: LayerSpecification = {
  id: 'tunnel_trunk_primary_casing',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'primary', 'trunk']],
  layout: {
    'line-join': 'round',
  },
} as LayerSpecification
