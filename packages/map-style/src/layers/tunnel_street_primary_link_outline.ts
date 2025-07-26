import type { StyleConfig } from '..'

export const tunnel_street_primary_link_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'tunnel-street-primary-link:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'tunnel', true], ['in', 'kind', 'primary'], ['==', 'link', true]],
  paint: {
    'line-color': 'rgb(234,176,126)',
    'line-dasharray': [1, 0.3],
    'line-width': {
      stops: [
        [12, 2],
        [14, 3],
        [16, 7],
        [18, 14],
        [20, 40],
      ],
    },
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
  minzoom: 13,
})
