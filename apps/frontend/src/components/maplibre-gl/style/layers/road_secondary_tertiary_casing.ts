import type { LayerSpecification } from 'maplibre-gl'

export const road_secondary_tertiary_casing: LayerSpecification = {
  id: 'road_secondary_tertiary_casing',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: [
    'all',
    ['!in', 'brunnel', 'bridge', 'tunnel'],
    ['in', 'class', 'secondary', 'tertiary'],
    ['!=', 'ramp', 1],
  ],
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
} as LayerSpecification
