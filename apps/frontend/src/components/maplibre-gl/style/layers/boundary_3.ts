import type { LayerSpecification } from 'maplibre-gl'

export const boundary_3: LayerSpecification = {
  id: 'boundary_3',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'boundary',
  minzoom: 8,
  filter: ['all', ['in', 'admin_level', 3, 4]],
  layout: {
    'line-join': 'round',
  },
} as LayerSpecification
