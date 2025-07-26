import type { StyleConfig } from '..'

export const transport_lightrail_service = (config: StyleConfig) => ({
  source: 'vector',
  id: 'transport-lightrail-service',
  type: 'line',
  'source-layer': 'streets',
  filter: [
    'all',
    ['in', 'kind', 'light_rail'],
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
