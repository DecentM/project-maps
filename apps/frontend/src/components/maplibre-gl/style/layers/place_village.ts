import type { LayerSpecification } from 'maplibre-gl'

export const place_village: LayerSpecification = {
  id: 'place_village',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'place',
  filter: ['all', ['==', 'class', 'village']],
  layout: {
    'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
    'text-font': ['Roboto Regular'],
    'text-max-width': 8,
    'text-size': {
      base: 1.2,
      stops: [
        [10, 12],
        [15, 22],
      ],
    },
  },
} as unknown as LayerSpecification
