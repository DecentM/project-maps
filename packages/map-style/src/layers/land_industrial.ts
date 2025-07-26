import type { StyleConfig } from '..'

export const land_industrial = (config: StyleConfig) => ({
  source: 'vector',
  id: 'land-industrial',
  type: 'fill',
  'source-layer': 'land',
  filter: ['all', ['in', 'kind', 'industrial', 'quarry', 'railway']],
  paint: {
    'fill-color': 'rgba(255,244,194,0.333)',
    'fill-opacity': {
      stops: [
        [10, 0],
        [11, 1],
      ],
    },
  },
})
