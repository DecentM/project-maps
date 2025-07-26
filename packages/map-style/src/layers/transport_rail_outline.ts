import type { StyleConfig } from '..'

export const transport_rail_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'transport-rail:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: [
    'all',
    ['in', 'kind', 'rail'],
    ['!has', 'service'],
    ['!=', 'bridge', true],
    ['!=', 'tunnel', true],
  ],
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
        [8, 0],
        [9, 1],
      ],
    },
  },
  minzoom: 8,
})
