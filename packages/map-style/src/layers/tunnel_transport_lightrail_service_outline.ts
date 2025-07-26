import type { StyleConfig } from '..'

export const tunnel_transport_lightrail_service_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'tunnel-transport-lightrail-service:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['in', 'kind', 'light_rail'], ['has', 'service'], ['==', 'tunnel', true]],
  paint: {
    'line-color': 'rgb(177,187,196)',
    'line-width': {
      stops: [
        [14, 0],
        [15, 1],
        [16, 1],
        [20, 14],
      ],
    },
  },
  minzoom: 14,
})
