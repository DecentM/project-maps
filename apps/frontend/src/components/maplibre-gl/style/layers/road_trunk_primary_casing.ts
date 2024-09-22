import type { LayerSpecification } from 'maplibre-gl'

export const road_trunk_primary_casing: LayerSpecification = {
  id: 'road_trunk_primary_casing',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['in', 'class', 'primary', 'trunk']],
  layout: {
    'line-join': 'round',
  },
} as LayerSpecification
