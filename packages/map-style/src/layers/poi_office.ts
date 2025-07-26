import type { StyleConfig } from '..'

export const poi_office = (config: StyleConfig) => ({
  source: 'vector',
  id: 'poi-office',
  type: 'symbol',
  'source-layer': 'pois',
  filter: ['to-boolean', ['get', 'office']],
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
