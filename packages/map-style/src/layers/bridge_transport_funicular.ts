import type { StyleConfig } from '..'

export const bridge_transport_funicular = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-transport-funicular',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['in', 'kind', 'funicular'], ['==', 'bridge', true]],
  minzoom: 13,
  paint: {
    'line-width': {
      stops: [
        [13, 0],
        [16, 1],
        [17, 2],
        [18, 3],
        [20, 5],
      ],
    },
    'line-color': 'rgb(177,187,196)',
  },
})
