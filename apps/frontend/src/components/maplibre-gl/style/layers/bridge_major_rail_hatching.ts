import type { LayerSpecification } from 'maplibre-gl'

export const bridge_major_rail_hatching: LayerSpecification = {
  id: 'bridge_major_rail_hatching',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'class', 'rail'], ['==', 'brunnel', 'bridge']],
  paint: {
    'line-color': '#bbb',
    'line-dasharray': [0.2, 8],
    'line-width': {
      base: 1.4,
      stops: [
        [14.5, 0],
        [15, 3],
        [20, 8],
      ],
    },
  },
} as unknown as LayerSpecification
