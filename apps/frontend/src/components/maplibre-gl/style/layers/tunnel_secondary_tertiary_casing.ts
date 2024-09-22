import type { LayerSpecification } from 'maplibre-gl'

export const tunnel_secondary_tertiary_casing: LayerSpecification = {
  id: 'tunnel_secondary_tertiary_casing',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'secondary', 'tertiary']],
  layout: {
    'line-join': 'round',
  },
} as LayerSpecification