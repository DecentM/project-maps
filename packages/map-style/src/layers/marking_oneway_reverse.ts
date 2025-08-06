import type { StyleConfig } from '..'

export const marking_oneway_reverse = (config: StyleConfig) => ({
  source: 'vector',
  id: 'marking-oneway-reverse',
  type: 'symbol',
  'source-layer': 'streets',
  filter: [
    'all',
    ['==', 'oneway_reverse', true],
    [
      'in',
      'kind',
      'trunk',
      'primary',
      'secondary',
      'tertiary',
      'unclassified',
      'residential',
      'living_street',
    ],
  ],
  layout: {
    'symbol-placement': 'line',
    'symbol-spacing': 75,
    'icon-rotate': -90,
    'icon-rotation-alignment': 'map',
    'icon-padding': 5,
    'symbol-avoid-edges': true,
    'icon-image': 'mdi:arrow-up-thin',
    'text-font': ['NotoSans-Regular'],
  },
  minzoom: 16,
  paint: {
    'icon-opacity': {
      stops: [
        [16, 0],
        [17, 0.4],
        [20, 0.4],
      ],
    },
    'text-opacity': {
      stops: [
        [16, 0],
        [17, 0.4],
        [20, 0.4],
      ],
    },
  },
})
