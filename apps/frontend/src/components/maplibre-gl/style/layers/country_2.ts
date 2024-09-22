import type { LayerSpecification } from 'maplibre-gl'

export const country_2: LayerSpecification = {
  id: 'country_2',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'place',
  filter: ['all', ['==', 'rank', 2], ['==', 'class', 'country']],
  layout: {
    'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
    'text-font': ['Roboto Condensed Italic'],
    'text-max-width': 6.25,
    'text-size': {
      stops: [
        [2, 11],
        [5, 17],
      ],
    },
  },
} as unknown as LayerSpecification
