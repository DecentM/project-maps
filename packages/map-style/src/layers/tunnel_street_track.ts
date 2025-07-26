import type { StyleConfig } from '..'

export const tunnel_street_track = (config: StyleConfig) => ({
  source: 'vector',
  id: 'tunnel-street-track',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'kind', 'track'], ['==', 'tunnel', true]],
  paint: {
    'line-color': 'rgb(247,247,247)',
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
