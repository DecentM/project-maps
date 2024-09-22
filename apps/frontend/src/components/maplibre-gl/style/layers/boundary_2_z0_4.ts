import type { LayerSpecification } from 'maplibre-gl'

export const boundary_2_z0_4: LayerSpecification = {
  id: 'boundary_2_z0-4',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'boundary',
  maxzoom: 5,
  filter: ['all', ['==', 'admin_level', 2], ['!has', 'claimed_by']],
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
} as LayerSpecification
