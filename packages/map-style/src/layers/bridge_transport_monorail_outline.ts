import type { StyleConfig } from '..'

export const bridge_transport_monorail_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-transport-monorail:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['in', 'kind', 'monorail'], ['==', 'bridge', true]],
  minzoom: 15,
  paint: {
    'line-color': 'rgb(177,187,196)',
    'line-width': {
      stops: [
        [15, 0],
        [16, 5],
        [18, 7],
        [20, 20],
      ],
    },
    'line-dasharray': [0.1, 0.5],
  },
})
