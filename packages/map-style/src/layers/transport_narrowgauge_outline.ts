import type { StyleConfig } from '..'

export const transport_narrowgauge_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'transport-narrowgauge:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: [
    'all',
    ['in', 'kind', 'narrow_gauge'],
    ['!has', 'service'],
    ['!=', 'bridge', true],
    ['!=', 'tunnel', true],
  ],
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
