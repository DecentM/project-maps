import type { StyleComponent } from '..'

export const data_z14: StyleComponent = (config) => ({
  id: 'poi_z14',
  type: 'symbol',
  source: 'openmaptiles',
  'source-layer': 'poi',
  minzoom: 14,
  filter: ['all', ['==', '$type', 'Point'], ['>=', 'rank', 1], ['<', 'rank', 7]],
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
    'text-font': ['RobotoCondensed-Italic'],
    'text-max-width': 9,
    'text-offset': [0, 0.6],
    'text-size': 12,
  },
  paint: {
    'text-color': '#666',
    'text-halo-blur': 0.5,
    'text-halo-color': '#ffffff',
    'text-halo-width': 1,
  },
})
