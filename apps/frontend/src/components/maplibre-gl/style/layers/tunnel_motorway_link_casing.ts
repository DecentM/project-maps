import type { LayerSpecification } from 'maplibre-gl'

export const tunnel_motorway_link_casing: LayerSpecification = {
  id: 'tunnel_motorway_link_casing',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'class', 'motorway'], ['==', 'ramp', 1], ['==', 'brunnel', 'tunnel']],
  layout: {
    'line-join': 'round',
  },
} as LayerSpecification
