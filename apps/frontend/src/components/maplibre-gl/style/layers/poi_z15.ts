import type { LayerSpecification } from 'maplibre-gl'

export const poi_z15: LayerSpecification = {
  id: 'poi_z15',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'poi',
  minzoom: 15,
  filter: ['all', ['==', '$type', 'Point'], ['>=', 'rank', 7], ['<', 'rank', 20]],
  layout: {
    'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
    'text-font': ['Roboto Condensed Italic'],
  },
}
