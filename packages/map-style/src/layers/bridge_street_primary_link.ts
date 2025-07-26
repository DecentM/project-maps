import type { StyleConfig } from '..'

export const bridge_street_primary_link = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-street-primary-link',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'primary'], ['==', 'link', true]],
  paint: {
    'line-color': 'rgb(255,238,170)',
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
  minzoom: 13,
})
