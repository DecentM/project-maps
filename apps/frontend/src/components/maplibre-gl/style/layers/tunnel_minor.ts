import type { LayerSpecification } from 'maplibre-gl'

export const tunnel_minor: LayerSpecification = {
  id: 'tunnel_minor',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'minor']],
  layout: { 'line-join': 'round' },
  paint: {
    'line-color': '#fff',
    'line-width': {
      base: 1.2,
      stops: [
        [13.5, 0],
        [14, 2.5],
        [20, 11.5],
      ],
    },
  },
} as unknown as LayerSpecification
