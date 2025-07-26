import type { StyleConfig } from '..'

export const boundary_country_disputed_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'boundary-country-disputed:outline',
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
        [3, 2],
        [10, 8],
      ],
    },
    'line-opacity': 0.75,
    'line-color': 'rgb(249,245,239)',
  },
})
