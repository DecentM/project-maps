import type { StyleConfig } from '..'

export const boundary_country_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'boundary-country:outline',
  type: 'line',
  'source-layer': 'boundaries',
  filter: [
    'all',
    ['==', 'admin_level', 2],
    ['!=', 'maritime', true],
    ['!=', 'disputed', true],
    ['!=', 'coastline', true],
  ],
  paint: {
    'line-color': 'rgb(249,245,239)',
    'line-blur': 1,
    'line-width': {
      stops: [
        [2, 0],
        [3, 2],
        [10, 8],
      ],
    },
    'line-opacity': 0.75,
  },
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
})
