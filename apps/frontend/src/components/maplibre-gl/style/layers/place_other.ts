import type { LayerSpecification } from 'maplibre-gl'

export const place_other: LayerSpecification = {
  id: 'place_other',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'place',
  filter: [
    'all',
    ['in', 'class', 'hamlet', 'island', 'islet', 'neighbourhood', 'suburb', 'quarter'],
  ],
  layout: {
    'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
    'text-font': ['Roboto Condensed Italic'],
    'text-letter-spacing': 0.1,
    'text-max-width': 9,
    'text-size': {
      base: 1.2,
      stops: [
        [12, 10],
        [15, 14],
      ],
    },
  },
} as unknown as LayerSpecification
