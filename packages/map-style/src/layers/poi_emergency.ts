import { Consts, type StyleConfig } from '..'

export const poi_emergency = (config: StyleConfig) => ({
  source: 'vector',
  id: 'poi-emergency',
  type: 'symbol',
  'source-layer': 'pois',
  filter: ['to-boolean', ['get', 'emergency']],
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
      ['get', 'emergency'],
      'defibrillator',
      'basics:icon-defibrillator',
      'fire_hydrant',
      'basics:icon-hydrant',
      'phone',
      'basics:icon-emergency_phone',
      '',
    ],
  },
  paint: {
    'icon-opacity': {
      stops: [
        [15, 0],
        [16, 0.2],
        [17, 0.6],
      ],
    },
    'text-opacity': {
      stops: [
        [15, 0],
        [16, 0.2],
        [17, 0.6],
      ],
    },
    'icon-color': Consts.Colours.emergency,
    'text-color': 'rgb(85,85,85)',
  },
})
