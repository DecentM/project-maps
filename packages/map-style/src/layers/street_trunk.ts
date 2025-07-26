import type { StyleConfig } from '..'

export const street_trunk = (config: StyleConfig) => ({
  source: 'vector',
  id: 'street-trunk',
  type: 'line',
  'source-layer': 'streets',
  filter: [
    'all',
    ['!=', 'bridge', true],
    ['!=', 'tunnel', true],
    ['in', 'kind', 'trunk'],
    ['!=', 'link', true],
  ],
  paint: {
    'line-color': 'rgb(255,238,170)',
    'line-width': {
      stops: [
        [7, 0],
        [8, 1],
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
        [7, 0],
        [8, 1],
      ],
    },
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
})
