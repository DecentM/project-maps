import type { StyleConfig } from '..'

export const transport_ferry = (config: StyleConfig) => ({
  source: 'vector',
  id: 'transport-ferry',
  type: 'line',
  'source-layer': 'ferries',
  minzoom: 10,
  paint: {
    'line-color': 'rgb(171,199,219)',
    'line-width': {
      stops: [
        [10, 1],
        [13, 2],
        [14, 3],
        [16, 4],
        [17, 6],
      ],
    },
    'line-opacity': {
      stops: [
        [10, 0],
        [11, 1],
      ],
    },
    'line-dasharray': [1, 1],
  },
})
