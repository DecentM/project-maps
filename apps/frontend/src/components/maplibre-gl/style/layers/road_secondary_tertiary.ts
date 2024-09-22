import type { LayerSpecification } from 'maplibre-gl'

export const road_secondary_tertiary: LayerSpecification = {
  id: 'road_secondary_tertiary',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['in', 'class', 'secondary', 'tertiary']],
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
} as LayerSpecification
