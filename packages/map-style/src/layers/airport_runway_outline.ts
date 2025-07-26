import type { StyleConfig } from '..'

export const airport_runway_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'airport-runway:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['==', 'kind', 'runway'],
  paint: {
    'line-color': 'rgb(207,205,202)',
    'line-width': {
      stops: [
        [11, 0],
        [12, 6],
        [13, 9],
        [14, 16],
        [15, 24],
        [16, 40],
        [17, 100],
        [18, 160],
        [20, 300],
      ],
    },
  },
  layout: {
    'line-join': 'round',
  },
})
