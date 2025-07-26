import type { StyleConfig } from '..'

export const boundary_country_disputed = (config: StyleConfig) => ({
  source: 'vector',
  id: 'boundary-country-disputed',
  type: 'line',
  'source-layer': 'boundaries',
  filter: [
    'all',
    ['==', 'admin_level', 2],
    ['==', 'disputed', true],
    ['!=', 'maritime', true],
    ['!=', 'coastline', true],
  ],
  paint: {
    'line-width': {
      stops: [
        [2, 0],
        [3, 1],
        [10, 4],
      ],
    },
    'line-color': 'rgb(190,188,207)',
    'line-dasharray': [2, 1],
  },
  layout: {
    'line-cap': 'square',
  },
})
