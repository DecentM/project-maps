import type { LayerSpecification } from 'maplibre-gl'

export const tunnel_motorway_link: LayerSpecification = {
  id: 'tunnel_motorway_link',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'class', 'motorway'], ['==', 'ramp', 1], ['==', 'brunnel', 'tunnel']],
  layout: {
    'line-join': 'round',
  },
} as LayerSpecification
