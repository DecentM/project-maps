import type { StyleConfig } from '..'

export const tunnel_street_motorway_link = (config: StyleConfig) => ({
  source: 'vector',
  id: 'tunnel-street-motorway-link',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'tunnel', true], ['in', 'kind', 'motorway'], ['==', 'link', true]],
  paint: {
    'line-color': 'rgb(255,209,148)',
    'line-width': {
      stops: [
        [12, 1],
        [14, 2],
        [16, 5],
        [18, 12],
        [20, 38],
      ],
    },
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'butt',
  },
  minzoom: 12,
})
