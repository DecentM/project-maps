import type { StyleConfig } from '..'

export const boundary_state_outline = (config: StyleConfig) => ({
  source: 'vector',
  id: 'boundary-state:outline',
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
    'line-color': 'rgb(250,245,240)',
    'line-blur': 1,
    'line-width': {
      stops: [
        [7, 0],
        [8, 2],
        [10, 4],
      ],
    },
    'line-opacity': 0.75,
  },
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
})
