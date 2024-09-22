import type { LayerSpecification } from 'maplibre-gl'

export const aeroway_taxiway: LayerSpecification = {
  id: 'aeroway_taxiway',
  type: 'line',
  source: 'openmaptiles',
  'source-layer': 'aeroway',
  minzoom: 11,
  filter: ['all', ['==', '$type', 'LineString'], ['==', 'class', 'taxiway']],
  paint: {
    'line-color': '#f0ede9',
    'line-width': {
      base: 1.2,
      stops: [
        [11, 0.5],
        [20, 6],
      ],
    },
  },
} as unknown as LayerSpecification
