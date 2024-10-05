import type { LayerSpecification } from 'maplibre-gl'

export const tunnel_trunk_primary: LayerSpecification = {
  id: 'tunnel_trunk_primary',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'primary', 'trunk']],
  layout: { 'line-join': 'round' },
  paint: {
    'line-color': '#fff4c6',
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
