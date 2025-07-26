import type { StyleConfig } from '..'

export const street_motorway_link = (config: StyleConfig) => ({
  source: 'vector',
  id: 'street-motorway-link',
  type: 'line',
  'source-layer': 'streets',
  filter: [
    'all',
    ['!=', 'bridge', true],
    ['!=', 'tunnel', true],
    ['in', 'kind', 'motorway'],
    ['==', 'link', true],
  ],
  paint: {
    'line-color': 'rgb(255,204,136)',
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
    'line-cap': 'round',
  },
  minzoom: 12,
})
