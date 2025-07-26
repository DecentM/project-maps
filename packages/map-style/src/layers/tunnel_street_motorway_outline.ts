import type { StyleConfig } from '..'

export const tunnel_street_motorway_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'tunnel-street-motorway:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'tunnel', true], ['in', 'kind', 'motorway'], ['!=', 'link', true]],
  paint: {
    'line-color': 'rgb(234,176,126)',
    'line-dasharray': [1, 0.3],
    'line-width': {
      stops: [
        [5, 0],
        [6, 2],
        [10, 5],
        [14, 5],
        [16, 14],
        [18, 38],
        [19, 84],
        [20, 168],
      ],
    },
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
})
