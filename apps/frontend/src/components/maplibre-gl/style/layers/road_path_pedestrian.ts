import type { LayerSpecification } from 'maplibre-gl'

export const road_path_pedestrian: LayerSpecification = {
  id: 'road_path_pedestrian',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  minzoom: 14,
  filter: [
    'all',
    ['==', '$type', 'LineString'],
    ['!in', 'brunnel', 'bridge', 'tunnel'],
    ['in', 'class', 'path', 'pedestrian'],
  ],
  layout: { 'line-join': 'round' },
  paint: {
    'line-color': 'hsl(0, 0%, 100%)',
    'line-dasharray': [1, 0.7],
    'line-width': {
      base: 1.2,
      stops: [
        [14, 1],
        [20, 10],
      ],
    },
  },
} as unknown as LayerSpecification
