import type { StyleConfig } from '..'

export const transport_monorail = (config: StyleConfig) => ({
  source: 'vector',
  id: 'transport-monorail',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['in', 'kind', 'monorail'], ['!=', 'bridge', true], ['!=', 'tunnel', true]],
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
