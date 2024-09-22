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
  layout: { 'line-cap': 'round', 'line-join': 'round' },
  paint: {
    'line-color': '#e9ac77',
    'line-width': {
      base: 1.2,
      stops: [
        [8, 1.5],
        [20, 17],
      ],
    },
  },
} as unknown as LayerSpecification
