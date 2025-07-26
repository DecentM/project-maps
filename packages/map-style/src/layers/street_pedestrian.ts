import type { StyleConfig } from '..'

export const street_pedestrian = (config: StyleConfig) => ({
  source: 'vector',
  id: 'street-pedestrian',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'kind', 'pedestrian'], ['!=', 'bridge', true], ['!=', 'tunnel', true]],
  paint: {
    'line-color': 'rgb(251,235,255)',
    'line-width': {
      stops: [
        [12, 1],
        [14, 2],
        [16, 5],
        [18, 24],
        [19, 60],
        [20, 120],
      ],
    },
    'line-opacity': {
      stops: [
        [12, 0],
        [13, 0],
        [14, 1],
      ],
    },
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
})
