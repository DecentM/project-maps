import type { StyleConfig } from '..'

export const bridge_street_residential = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-street-residential',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'kind', 'residential'], ['==', 'bridge', true]],
  paint: {
    'line-color': 'rgb(255,255,255)',
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
        [13, 1],
      ],
    },
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'butt',
  },
})
