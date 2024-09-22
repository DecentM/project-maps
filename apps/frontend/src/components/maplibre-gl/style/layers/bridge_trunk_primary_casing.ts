import type { LayerSpecification } from 'maplibre-gl'

export const bridge_trunk_primary_casing: LayerSpecification = {
  id: 'bridge_trunk_primary_casing',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'brunnel', 'bridge'], ['in', 'class', 'primary', 'trunk']],
  layout: {
    'line-join': 'round',
  },
} as LayerSpecification
