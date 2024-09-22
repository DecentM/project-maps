import type { LayerSpecification } from 'maplibre-gl'

export const road_motorway: LayerSpecification = {
  id: 'road_motorway',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  minzoom: 5,
  filter: [
    'all',
    ['!in', 'brunnel', 'bridge', 'tunnel'],
    ['==', 'class', 'motorway'],
    ['!=', 'ramp', 1],
  ],
  layout: { 'line-cap': 'round', 'line-join': 'round' },
  paint: {
    'line-color': {
      base: 1,
      stops: [
        [5, 'hsl(26, 87%, 62%)'],
        [6, '#fc8'],
      ],
    },
    'line-width': {
      base: 1.2,
      stops: [
        [5, 0],
        [7, 1],
        [20, 18],
      ],
    },
  },
} as unknown as LayerSpecification
