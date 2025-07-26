import type { StyleConfig } from '..'

export const transport_funicular_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'transport-funicular:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['in', 'kind', 'funicular'], ['!=', 'bridge', true], ['!=', 'tunnel', true]],
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
