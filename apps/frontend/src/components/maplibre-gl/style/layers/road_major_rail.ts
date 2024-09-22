import type { LayerSpecification } from 'maplibre-gl'

export const road_major_rail: LayerSpecification = {
  id: 'road_major_rail',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['==', 'class', 'rail']],
  paint: {
    'line-color': '#bbb',
    'line-width': {
      base: 1.4,
      stops: [
        [14, 0.4],
        [15, 0.75],
        [20, 2],
      ],
    },
  },
} as unknown as LayerSpecification
