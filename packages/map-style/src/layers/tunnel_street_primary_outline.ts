import type { StyleConfig } from '..'

export const tunnel_street_primary_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'tunnel-street-primary:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'tunnel', true], ['in', 'kind', 'primary'], ['!=', 'link', true]],
  paint: {
    'line-color': 'rgb(234,176,126)',
    'line-dasharray': [1, 0.3],
    'line-width': {
      stops: [
        [8, 0],
        [9, 1],
        [10, 4],
        [14, 6],
        [16, 12],
        [18, 36],
        [19, 74],
        [20, 144],
      ],
    },
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
})
