import type { LayerSpecification } from 'maplibre-gl'

export const tunnel_motorway_casing: LayerSpecification = {
  id: 'tunnel_motorway_casing',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'transportation',
  filter: ['all', ['==', 'class', 'motorway'], ['!=', 'ramp', 1], ['==', 'brunnel', 'tunnel']],
  layout: { 'line-join': 'round' },
  paint: {
    'line-color': '#e9ac77',
    'line-dasharray': [0.5, 0.25],
    'line-width': {
      base: 1.2,
      stops: [
        [5, 0.4],
        [6, 0.7],
        [7, 1.75],
        [20, 22],
      ],
    },
  },
} as unknown as LayerSpecification
