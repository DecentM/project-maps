import type { LayerSpecification } from 'maplibre-gl'

export const country_3: LayerSpecification = {
  id: 'country_3',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'place',
  filter: ['all', ['>=', 'rank', 3], ['==', 'class', 'country']],
  layout: {
    'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
    'text-font': ['Roboto Condensed Italic'],
    'text-max-width': 6.25,
    'text-size': {
      stops: [
        [3, 11],
        [7, 17],
      ],
    },
  },
} as unknown as LayerSpecification
