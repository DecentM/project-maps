import type { LayerSpecification } from 'maplibre-gl'

export const road_motorway_link: LayerSpecification = {
  id: 'road_motorway_link',
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
  layout: { 'line-cap': 'round', 'line-join': 'round' },
  paint: {
    'line-color': '#fc8',
    'line-width': {
      base: 1.2,
      stops: [
        [12.5, 0],
        [13, 1.5],
        [14, 2.5],
        [20, 11.5],
      ],
    },
  },
} as unknown as LayerSpecification
