import type { LayerSpecification } from 'maplibre-gl'

export const bridge_street: LayerSpecification = {
  id: 'bridge_street',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'brunnel', 'bridge'], ['in', 'class', 'minor']],
  layout: {
    'line-join': 'round',
  },
} as LayerSpecification
