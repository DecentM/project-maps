import type { LayerSpecification } from 'maplibre-gl'

export const aeroway_runway: LayerSpecification = {
  id: 'aeroway_runway',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'aeroway',
  minzoom: 11,
  filter: ['all', ['==', '$type', 'LineString'], ['==', 'class', 'runway']],
  paint: {
    'line-color': '#f0ede9',
    'line-width': {
      base: 1.2,
      stops: [
        [11, 3],
        [20, 16],
      ],
    },
  },
} as unknown as LayerSpecification
