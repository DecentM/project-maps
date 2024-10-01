import type { LayerSpecification } from 'maplibre-gl'

export const poi_z16: LayerSpecification = {
  id: 'poi_z16',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'poi',
  minzoom: 16,
  filter: ['all', ['==', '$type', 'Point'], ['>=', 'rank', 20]],
  layout: {
    'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
    'text-font': ['RobotoCondensed-Italic'],
  },
}
