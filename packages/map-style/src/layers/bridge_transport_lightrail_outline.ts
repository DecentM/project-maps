import type { StyleConfig } from '..'

export const bridge_transport_lightrail_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-transport-lightrail:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['in', 'kind', 'light_rail'], ['!has', 'service'], ['==', 'bridge', true]],
  paint: {
    'line-color': 'rgb(177,187,196)',
    'line-width': {
      stops: [
        [8, 1],
        [13, 1],
        [15, 1],
        [20, 14],
      ],
    },
    'line-opacity': {
      stops: [
        [11, 0],
        [12, 1],
      ],
    },
  },
  minzoom: 8,
})
