import type { LayerSpecification } from 'maplibre-gl'

export const road_link: LayerSpecification = {
  id: 'road_link',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  minzoom: 13,
  filter: [
    'all',
    ['!in', 'brunnel', 'bridge', 'tunnel'],
    ['==', 'ramp', 1],
    ['!in', 'class', 'pedestrian', 'path', 'track', 'service', 'motorway'],
  ],
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
} as LayerSpecification
