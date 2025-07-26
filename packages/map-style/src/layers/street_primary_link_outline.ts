import type { StyleConfig } from '..'

export const street_primary_link_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'street-primary-link:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: [
    'all',
    ['!=', 'bridge', true],
    ['!=', 'tunnel', true],
    ['in', 'kind', 'primary'],
    ['==', 'link', true],
  ],
  paint: {
    'line-color': 'rgb(233,172,119)',
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
