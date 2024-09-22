import type { LayerSpecification } from 'maplibre-gl'

export const bridge_secondary_tertiary: LayerSpecification = {
  id: 'bridge_secondary_tertiary',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'brunnel', 'bridge'], ['in', 'class', 'secondary', 'tertiary']],
  layout: {
    'line-join': 'round',
  },
} as LayerSpecification
