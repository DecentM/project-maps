import type { LayerSpecification } from 'maplibre-gl'

export const road_motorway_link_casing: LayerSpecification = {
  id: 'road_motorway_link_casing',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  minzoom: 12,
  filter: [
    'all',
    ['!in', 'brunnel', 'bridge', 'tunnel'],
    ['==', 'class', 'motorway'],
    ['==', 'ramp', 1],
  ],
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
} as LayerSpecification
