import type { StyleConfig } from '..'

export const land_garden = (config: StyleConfig) => ({
  source: 'vector',
  id: 'land-garden',
  type: 'fill',
  'source-layer': 'land',
  filter: ['all', ['in', 'kind', 'allotments', 'garden']],
  paint: {
    'fill-color': 'rgb(217,217,165)',
    'fill-opacity': {
      stops: [
        [11, 0],
        [12, 1],
      ],
    },
  },
})
