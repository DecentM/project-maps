import type { StyleConfig } from '..'

export const land_forest = (config: StyleConfig) => ({
  source: 'vector',
  id: 'land-forest',
  type: 'fill',
  'source-layer': 'land',
  filter: ['all', ['in', 'kind', 'forest']],
  paint: {
    'fill-color': 'rgb(102,170,68)',
    'fill-opacity': {
      stops: [
        [7, 0],
        [8, 0.1],
      ],
    },
  },
})
