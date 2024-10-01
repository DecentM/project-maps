import type { LayerSpecification } from 'maplibre-gl'

export const poi_z14: LayerSpecification = {
  id: 'poi_z14',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'poi',
  minzoom: 14,
  filter: ['all', ['==', '$type', 'Point'], ['>=', 'rank', 1], ['<', 'rank', 7]],
  layout: {
    'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
    'text-font': ['RobotoCondensed-Italic'],
  },
}
