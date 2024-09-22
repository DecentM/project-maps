import type { LayerSpecification } from 'maplibre-gl'

export const poi_z16: LayerSpecification = {
  id: 'poi_z16',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'poi',
  minzoom: 16,
  filter: ['all', ['==', '$type', 'Point'], ['>=', 'rank', 20]],
  layout: {
    'icon-image': [
      'match',
      ['get', 'subclass'],
      ['florist', 'furniture', 'soccer', 'tennis'],
      ['get', 'subclass'],
      ['get', 'class'],
    ],
    'text-anchor': 'top',
    'text-field': ['coalesce', ['get', 'name_int'], ['get', 'name:latin']],
    'text-font': ['Roboto Condensed Italic'],
    'text-max-width': 9,
    'text-offset': [0, 0.6],
    'text-size': 12,
  },
} as LayerSpecification
