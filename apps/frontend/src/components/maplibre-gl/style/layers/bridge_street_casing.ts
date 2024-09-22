import type { LayerSpecification } from 'maplibre-gl'

export const bridge_street_casing: LayerSpecification = {
  id: 'bridge_street_casing',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'brunnel', 'bridge'], ['in', 'class', 'street', 'street_limited']],
  layout: { 'line-join': 'round' },
  paint: {
    'line-color': 'hsl(36, 6%, 74%)',
    'line-opacity': {
      stops: [
        [12, 0],
        [12.5, 1],
      ],
    },
    'line-width': {
      base: 1.2,
      stops: [
        [12, 0.5],
        [13, 1],
        [14, 4],
        [20, 25],
      ],
    },
  },
} as unknown as LayerSpecification
