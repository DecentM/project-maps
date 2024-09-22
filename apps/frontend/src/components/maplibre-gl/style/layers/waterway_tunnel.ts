import type { LayerSpecification } from 'maplibre-gl'

export const waterway_tunnel: LayerSpecification = {
  id: 'waterway_tunnel',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'waterway',
  filter: ['all', ['==', 'brunnel', 'tunnel']],
  paint: {
    'line-color': '#a0c8f0',
    'line-dasharray': [3, 3],
    'line-gap-width': {
      stops: [
        [12, 0],
        [20, 6],
      ],
    },
  },
} as unknown as LayerSpecification
