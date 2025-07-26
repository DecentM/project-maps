import type { StyleConfig } from '..'

export const airport_runway = (config: StyleConfig) => ({
  source: 'vector',
  id: 'airport-runway',
  type: 'line',
  'source-layer': 'streets',
  filter: ['==', 'kind', 'runway'],
  paint: {
    'line-color': 'rgb(255,255,255)',
    'line-width': {
      stops: [
        [11, 0],
        [12, 5],
        [13, 8],
        [14, 14],
        [15, 22],
        [16, 38],
        [17, 98],
        [18, 158],
        [20, 298],
      ],
    },
    'line-opacity': {
      stops: [
        [11, 0],
        [12, 1],
      ],
    },
  },
  layout: {
    'line-join': 'round',
  },
})
