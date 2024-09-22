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
  layout: {
    'line-join': 'round',
  },
} as LayerSpecification
