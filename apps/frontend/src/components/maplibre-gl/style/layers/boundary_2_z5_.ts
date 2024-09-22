import type { LayerSpecification } from 'maplibre-gl'

export const boundary_2_z5_: LayerSpecification = {
  id: 'boundary_2_z5-',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'boundary',
  minzoom: 5,
  filter: ['all', ['==', 'admin_level', 2]],
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
} as LayerSpecification
