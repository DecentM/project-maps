import type { LayerSpecification } from 'maplibre-gl'

export const data_z16: LayerSpecification = {
  id: 'data_z16',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'poi',
  minzoom: 15,
  filter: ['all', ['==', '$type', 'Point'], ['>=', 'rank', 20]],
  layout: {
    'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
    'text-font': ['RobotoCondensed-Italic'],
  },
  paint: {
    'text-color': 'rgba(0, 0, 0, 0)',
  },
}
