import type { LayerSpecification } from 'maplibre-gl'

export const road_link_casing: LayerSpecification = {
  id: 'road_link_casing',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  minzoom: 13,
  filter: [
    'all',
    ['!in', 'brunnel', 'bridge', 'tunnel'],
    ['!in', 'class', 'pedestrian', 'path', 'track', 'service', 'motorway'],
    ['==', 'ramp', 1],
  ],
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
} as LayerSpecification
