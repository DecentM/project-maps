import type { StyleConfig } from '..'

export const bridge_transport_narrowgauge = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-transport-narrowgauge',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['in', 'kind', 'narrow_gauge'], ['!has', 'service'], ['==', 'bridge', true]],
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
