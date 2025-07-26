import type { StyleConfig } from '..'

export const poi_leisure = (config: StyleConfig) => ({
  source: 'vector',
  id: 'poi-leisure',
  type: 'symbol',
  'source-layer': 'pois',
  filter: ['to-boolean', ['get', 'leisure']],
  minzoom: 16,
  layout: {
    'icon-size': {
      stops: [
        [16, 0.5],
        [19, 0.5],
        [20, 1],
      ],
    },
    'symbol-placement': 'point',
    'icon-optional': true,
    'text-font': ['Noto Sans Regular'],
    'text-field': [
      'coalesce',
      ['get', 'name_int'],
      ['get', 'name_en'],
      ['get', 'name:latin'],
      ['get', 'name'],
    ],
    'icon-anchor': 'bottom',
    'text-size': 10,
    'text-anchor': 'top',
    'icon-image': [
      'match',
      ['get', 'leisure'],
      'golf_course',
      'basics:icon-golf',
      'ice_rink',
      'basics:icon-icerink',
      'pitch',
      'basics:icon-pitch',
      'stadium',
      'basics:icon-stadium',
      'swimming_pool',
      'basics:icon-swimming',
      'water_park',
      'basics:icon-waterpark',
      'basics:icon-sports',
    ],
  },
  paint: {
    'icon-opacity': {
      stops: [
        [16, 0],
        [17, 0.4],
      ],
    },
    'text-opacity': {
      stops: [
        [16, 0],
        [17, 0.4],
      ],
    },
    'icon-color': 'rgb(85,85,85)',
    'text-color': 'rgb(85,85,85)',
  },
})
