import type { LayerSpecification } from 'maplibre-gl'

export const road_minor_casing: LayerSpecification = {
  id: 'road_minor_casing',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: [
    'all',
    ['==', '$type', 'LineString'],
    ['!in', 'brunnel', 'bridge', 'tunnel'],
    ['in', 'class', 'minor'],
    ['!=', 'ramp', 1],
  ],
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
} as LayerSpecification
