import type { StyleConfig } from '..'

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
