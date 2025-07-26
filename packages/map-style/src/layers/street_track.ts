import type { StyleConfig } from '..'

export const street_track = (config: StyleConfig) => ({
  source: 'vector',
  id: 'street-track',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'kind', 'track'], ['!=', 'bridge', true], ['!=', 'tunnel', true]],
  paint: {
    'line-color': 'rgb(255,255,255)',
    'line-width': {
      stops: [
        [14, 1],
        [16, 3],
        [18, 16],
        [19, 44],
        [20, 88],
      ],
    },
    'line-opacity': {
      stops: [
        [14, 0],
        [15, 1],
      ],
    },
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
})
