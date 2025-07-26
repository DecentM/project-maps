import type { StyleConfig } from '..'

export const bridge_street_motorway = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-street-motorway',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'motorway'], ['!=', 'link', true]],
  paint: {
    'line-color': 'rgb(255,204,136)',
    'line-width': {
      stops: [
        [5, 0],
        [6, 1],
        [10, 4],
        [14, 4],
        [16, 12],
        [18, 36],
        [19, 80],
        [20, 160],
      ],
    },
    'line-opacity': {
      stops: [
        [5, 0],
        [6, 1],
      ],
    },
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'butt',
  },
})
