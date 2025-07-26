import type { StyleConfig } from '..'

export const boundary_country = (config: StyleConfig) => ({
  source: 'vector',
  id: 'boundary-country',
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
    'line-color': 'rgb(166,166,200)',
    'line-width': {
      stops: [
        [2, 0],
        [3, 1],
        [10, 4],
      ],
    },
  },
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
})
