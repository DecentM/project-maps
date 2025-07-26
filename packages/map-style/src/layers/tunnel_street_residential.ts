import type { StyleConfig } from '..'

export const tunnel_street_residential = (config: StyleConfig) => ({
  source: 'vector',
  id: 'tunnel-street-residential',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'kind', 'residential'], ['==', 'tunnel', true]],
  paint: {
    'line-color': 'rgb(247,247,247)',
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
    'line-cap': 'round',
  },
})
