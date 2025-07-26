import type { StyleConfig } from '..'

export const street_tertiary_link_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'street-tertiary-link:outline',
  type: 'line',
  'source-layer': 'streets',
  filter: [
    'all',
    ['!=', 'bridge', true],
    ['!=', 'tunnel', true],
    ['in', 'kind', 'tertiary'],
    ['==', 'link', true],
  ],
  paint: {
    'line-color': 'rgb(207,205,202)',
    'line-width': {
      stops: [
        [12, 2],
        [14, 3],
        [16, 6],
        [18, 26],
        [19, 64],
        [20, 128],
      ],
    },
    'line-opacity': {
      stops: [
        [12, 0],
        [13, 1],
      ],
    },
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
})
