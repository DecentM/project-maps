import type { LayerSpecification } from 'maplibre-gl'

export const bridge_link_casing: LayerSpecification = {
  id: 'bridge_link_casing',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'class', 'link'], ['==', 'brunnel', 'bridge']],
  layout: {
    'line-join': 'round',
  },
} as LayerSpecification
