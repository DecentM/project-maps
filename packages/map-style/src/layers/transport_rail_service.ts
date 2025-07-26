import type { StyleConfig } from '..'

export const transport_rail_service = (config: StyleConfig) => ({
  source: 'vector',
  id: 'transport-rail-service',
  type: 'line',
  'source-layer': 'streets',
  filter: [
    'all',
    ['in', 'kind', 'rail'],
    ['has', 'service'],
    ['!=', 'bridge', true],
    ['!=', 'tunnel', true],
  ],
  paint: {
    'line-color': 'rgb(197,204,211)',
    'line-width': {
      stops: [
        [15, 0],
        [16, 1],
        [20, 10],
      ],
    },
    'line-dasharray': [2, 2],
  },
  minzoom: 15,
})
