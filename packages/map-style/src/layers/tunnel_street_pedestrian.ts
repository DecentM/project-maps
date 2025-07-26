import type { StyleConfig } from '..'

export const tunnel_street_pedestrian = (config: StyleConfig) => ({
  source: 'vector',
  id: 'tunnel-street-pedestrian',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'kind', 'pedestrian'], ['==', 'tunnel', true]],
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
