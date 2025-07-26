import type { StyleConfig } from '..'

export const tunnel_street_motorway = (config: StyleConfig) => ({
  source: 'vector',
  id: 'tunnel-street-motorway',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'tunnel', true], ['in', 'kind', 'motorway'], ['!=', 'link', true]],
  paint: {
    'line-color': 'rgb(255,209,148)',
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
