import type { StyleConfig } from '..'

export const boundary_state = (config: StyleConfig) => ({
  source: 'vector',
  id: 'boundary-state',
  type: 'line',
  'source-layer': 'boundaries',
  filter: [
    'all',
    ['==', 'admin_level', 4],
    ['!=', 'maritime', true],
    ['!=', 'disputed', true],
    ['!=', 'coastline', true],
  ],
  paint: {
    'line-color': 'rgb(166,166,200)',
    'line-width': {
      stops: [
        [7, 0],
        [8, 1],
        [10, 2],
      ],
    },
  },
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
})
