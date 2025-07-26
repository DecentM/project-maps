import type { StyleConfig } from '..'

export const transport_subway = (config: StyleConfig) => ({
  source: 'vector',
  id: 'transport-subway',
  type: 'line',
  'source-layer': 'streets',
  filter: [
    'all',
    ['in', 'kind', 'subway'],
    ['!has', 'service'],
    ['!=', 'bridge', true],
    ['!=', 'tunnel', true],
  ],
  paint: {
    'line-color': 'rgb(188,202,213)',
    'line-width': {
      stops: [
        [11, 0],
        [12, 1],
        [15, 2],
        [16, 2],
        [18, 5],
        [19, 6],
        [20, 8],
      ],
    },
    'line-dasharray': [2, 2],
    'line-opacity': {
      stops: [
        [14, 0],
        [15, 1],
      ],
    },
  },
})
