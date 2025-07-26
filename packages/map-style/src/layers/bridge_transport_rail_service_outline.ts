import type { StyleConfig } from '..'

export const bridge_transport_rail_service_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-transport-rail-service:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['in', 'kind', 'rail'], ['has', 'service'], ['==', 'bridge', true]],
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
