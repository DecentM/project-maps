import type { LayerSpecification } from 'maplibre-gl'

export const tunnel_link: LayerSpecification = {
  id: 'tunnel_link',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'ramp', 1], ['==', 'brunnel', 'tunnel']],
  layout: {
    'line-join': 'round',
  },
} as LayerSpecification
