import type { LayerSpecification } from 'maplibre-gl'

export const bridge_transit_rail: LayerSpecification = {
  id: 'bridge_transit_rail',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'class', 'transit'], ['==', 'brunnel', 'bridge']],
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
