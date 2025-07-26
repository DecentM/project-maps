import type { StyleConfig } from '..'

export const street_primary = (config: StyleConfig) => ({
  source: 'vector',
  id: 'street-primary',
  type: 'line',
  'source-layer': 'streets',
  filter: [
    'all',
    ['!=', 'bridge', true],
    ['!=', 'tunnel', true],
    ['in', 'kind', 'primary'],
    ['!=', 'link', true],
  ],
  paint: {
    'line-color': 'rgb(255,238,170)',
    'line-width': {
      stops: [
        [8, 0],
        [9, 2],
        [10, 3],
        [14, 5],
        [16, 10],
        [18, 34],
        [19, 70],
        [20, 140],
      ],
    },
    'line-opacity': {
      stops: [
        [8, 0],
        [9, 1],
      ],
    },
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
})
