import type { StyleConfig } from '..'

export const tunnel_street_secondary_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'tunnel-street-secondary:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'tunnel', true], ['in', 'kind', 'secondary'], ['!=', 'link', true]],
  paint: {
    'line-color': 'rgb(234,176,126)',
    'line-dasharray': [1, 0.3],
    'line-width': {
      stops: [
        [11, 2],
        [14, 5],
        [16, 8],
        [18, 30],
        [19, 68],
        [20, 138],
      ],
    },
    'line-opacity': {
      stops: [
        [11, 0],
        [12, 1],
      ],
    },
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
})
