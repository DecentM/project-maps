import type { StyleConfig } from '..'

export const bridge_transport_rail_service = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-transport-rail-service',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['in', 'kind', 'rail'], ['has', 'service'], ['==', 'bridge', true]],
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
