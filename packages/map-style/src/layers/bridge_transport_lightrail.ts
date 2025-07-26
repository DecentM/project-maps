import type { StyleConfig } from '..'

export const bridge_transport_lightrail = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-transport-lightrail',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['in', 'kind', 'light_rail'], ['!has', 'service'], ['==', 'bridge', true]],
  paint: {
    'line-color': 'rgb(197,204,211)',
    'line-width': {
      stops: [
        [14, 0],
        [15, 1],
        [20, 10],
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
  minzoom: 14,
})
