import type { LayerSpecification } from 'maplibre-gl'

export const country_1: LayerSpecification = {
  id: 'country_1',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'place',
  filter: ['all', ['==', 'rank', 1], ['==', 'class', 'country']],
  layout: {
    'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
    'text-font': ['Roboto Condensed Italic'],
    'text-max-width': 6.25,
    'text-size': {
      stops: [
        [1, 11],
        [4, 17],
      ],
    },
  },
} as unknown as LayerSpecification
