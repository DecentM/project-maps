import type { LayerSpecification } from 'maplibre-gl'

export const state: LayerSpecification = {
  id: 'state',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'place',
  maxzoom: 6,
  filter: ['all', ['==', 'class', 'state']],
  layout: {
    'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
    'text-font': ['Roboto Condensed Italic'],
    'text-size': {
      stops: [
        [4, 11],
        [6, 15],
      ],
    },
  },
} as unknown as LayerSpecification
