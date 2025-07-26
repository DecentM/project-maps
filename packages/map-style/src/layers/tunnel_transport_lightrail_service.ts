import type { StyleConfig } from '..'

export const tunnel_transport_lightrail_service = (config: StyleConfig) => ({
  source: 'vector',
  id: 'tunnel-transport-lightrail-service',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['in', 'kind', 'light_rail'], ['has', 'service'], ['==', 'tunnel', true]],
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
