import type { LayerSpecification } from 'maplibre-gl'

export const data_z15: LayerSpecification = {
  id: 'data_z15',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'poi',
  minzoom: 15,
  filter: ['all', ['==', '$type', 'Point'], ['>=', 'rank', 7], ['<', 'rank', 20]],
  layout: {
    'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
    'text-font': ['RobotoCondensed-Italic'],
  },
  paint: {
    'text-color': 'rgba(0, 0, 0, 0)',
  },
}
