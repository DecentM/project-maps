import type { LayerSpecification } from 'maplibre-gl'

export const continent: LayerSpecification = {
  id: 'continent',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'place',
  maxzoom: 1,
  filter: ['all', ['==', 'class', 'continent']],
  layout: {
    'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
    'text-font': ['Roboto Condensed Italic'],
    'text-size': 13,
    'text-transform': 'uppercase',
    'text-justify': 'center',
  },
} as LayerSpecification