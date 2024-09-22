import type { LayerSpecification } from 'maplibre-gl'

export const road_trunk_primary: LayerSpecification = {
  id: 'road_trunk_primary',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['in', 'class', 'primary', 'trunk']],
  layout: { 'line-join': 'round' },
  paint: {
    'line-color': '#fea',
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
