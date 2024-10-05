import type { LayerSpecification } from 'maplibre-gl'

export const road_minor: LayerSpecification = {
  id: 'road_minor',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: [
    'all',
    ['==', '$type', 'LineString'],
    ['!in', 'brunnel', 'bridge', 'tunnel'],
    ['in', 'class', 'minor'],
  ],
  layout: { 'line-cap': 'round', 'line-join': 'round' },
  paint: {
    'line-color': '#fff',
    'line-width': {
      base: 1.2,
      stops: [
        [13.5, 0],
        [14, 2.5],
        [20, 18],
      ],
    },
  },
} as unknown as LayerSpecification
